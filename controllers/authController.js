const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateToken } = require('../utils/generateToken');
const transporter = require('../config/nodemailer');
const { generateToken2 } = require('../utils/tokenGenerator');
const { signupTemplate, resetPasswordTemplate } = require('../utils/emailTemplates');


exports.signup = async (req, res) => {
  const { fullName, email, password, gender, dob } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      if (!user.isVerified) {
        await User.deleteOne({ _id: user._id });
        return res.status(400).json({ message: 'Invalid email' });
      } else {
        return res.status(400).json({ message: 'User already exists' });
      }
    }

    user = await User.create({
      fullName,
      email,
      password,
      gender,
      dob,
      isVerified: false,  // add this field to track verification status
    });

    const token = generateToken2();
    user.emailToken = token;
    await user.save();

    const mailOptions = {
      from: `EDU Verse Team <${process.env.MAIL_USER}>`,
      to: user.email,
      subject: 'Verify Your EDU Verse Desktop App Account',
      html: signupTemplate(user.fullName, token),
    };

    transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Signup successful, verification email sent' });

  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({ message: 'Internal Server Error' }); 
  }
};



exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (!user.isVerified) {
      await User.deleteOne({ _id: user._id });
      return res.status(401).json({ message: 'Invalid email' });
    }

    if (await bcrypt.compare(password, user.password)) {
      res.json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        gender: user.gender,
        dob: user.dob,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};






exports.verifyEmail = async (req, res) => {
  const { token } = req.params;
  try {
    const user = await User.findOne({ emailToken: token });
    if (!user) {
      return res.status(400).json({ error: 'Invalid token' });
    }

    user.emailToken = null;
    user.isVerified = true;
    await user.save();
    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Verification failed' });
  }
};

exports.resetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const token = generateToken2();
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 1800000; // 30 minutes
    await user.save();

    const mailOptions = {
      from: `EDU Verse Team <${process.env.MAIL_USER}>`,
      to: user.email,
      subject: 'Reset Your EDU Verse Desktop App Password',
      html: resetPasswordTemplate(user.fullName, token),
    };

    transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    res.status(500).json({ error: 'Password reset failed' });
  }
};

exports.setNewPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const user = await User.findOne({ resetToken: token, resetTokenExpiry: { $gt: Date.now() } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    user.password = newPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();
    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ error: 'Password reset failed' });
  }
};

    /*
    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      gender: user.gender,
      dob: user.dob,
      token: generateToken(user._id),
    });
    */


    /*

exports.signup = async (req, res) => {
  const { fullName, email, password, gender, dob } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      fullName,
      email,
      password,
      gender,
      dob,
    });

    const token = generateToken2();
    user.emailToken = token;
    await user.save();

    const mailOptions = {
      from: `EDU Verse Team <${process.env.MAIL_USER}>`,
      to: user.email,
      subject: 'Verify Your EDU Verse Desktop App Account',
      html: signupTemplate(user.fullName, token),
    };

    transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Signup successful, verification email sent' });


  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({ message: 'Internal Server Error' }); 
  }
};

*/



/*
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        // new edit
        _id: user._id,
        fullName: user.fullName,
        
        email: user.email,
        gender: user.gender,
        dob: user.dob,
        token: generateToken(user._id),
      });

      //console.log(res.getHeaders())
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
*/

