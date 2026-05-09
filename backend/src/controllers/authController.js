// src/controllers/authController.js
// Handles: Register, Login
// Security: bcrypt password hashing + JWT tokens (free, no external service)

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// ─── REGISTER ────────────────────────────────────────────────────────────────
async function register(req, res) {
  const { fullName, email, password } = req.body;

  // Validate inputs
  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email address." });
  }

  try {
    // Check if email already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
      },
    });

    // Log registration
    await prisma.systemLog.create({
      data: {
        userId: user.id,
        action: "register",
        detail: `New user registered: ${email}`,
      },
    });

    return res.status(201).json({
      message: "Account created successfully.",
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        plan: user.plan,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Server error during registration." });
  }
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Generate JWT token (expires in 7 days)
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Log login
    await prisma.systemLog.create({
      data: {
        userId: user.id,
        action: "login",
        detail: `User logged in: ${email}`,
      },
    });

    return res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        plan: user.plan,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error during login." });
  }
}

// ─── GET PROFILE ──────────────────────────────────────────────────────────────
async function getProfile(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        fullName: true,
        email: true,
        plan: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Get report stats for this user
    const totalReports = await prisma.report.count({ where: { userId: req.user.id } });
    const completedReports = await prisma.report.count({
      where: { userId: req.user.id, status: "completed" },
    });
    const processingReports = await prisma.report.count({
      where: { userId: req.user.id, status: "processing" },
    });

    return res.status(200).json({
      user,
      stats: {
        totalReports,
        completedReports,
        processingReports,
      },
    });
  } catch (err) {
    console.error("Get profile error:", err);
    return res.status(500).json({ message: "Server error." });
  }
}

// ─── UPDATE PROFILE ───────────────────────────────────────────────────────────
async function updateProfile(req, res) {
  const { fullName, email } = req.body;

  if (!fullName || !email) {
    return res.status(400).json({ message: "Name and email are required." });
  }

  try {
    // Check email not already taken by another user
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing && existing.id !== req.user.id) {
      return res.status(409).json({ message: "Email already in use by another account." });
    }

    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: { fullName, email },
      select: {
        id: true,
        fullName: true,
        email: true,
        plan: true,
        role: true,
        createdAt: true,
      },
    });

    return res.status(200).json({
      message: "Profile updated.",
      user: updated,
    });
  } catch (err) {
    console.error("Update profile error:", err);
    return res.status(500).json({ message: "Server error." });
  }
}

module.exports = { register, login, getProfile, updateProfile };
