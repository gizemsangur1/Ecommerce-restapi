const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "Kullanıcı bulunamadı." });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Profil bilgileri alınamadı.", error: error.message });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "Kullanıcı bulunamadı." });

    const { name, email, password } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await user.save();

    res.json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } catch (error) {
    res.status(500).json({ message: "Profil güncellenemedi.", error: error.message });
  }
};


exports.changePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "Kullanıcı bulunamadı." });

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Mevcut ve yeni şifre gereklidir." });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(401).json({ message: "Mevcut şifre yanlış." });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.json({ message: "Şifre başarıyla değiştirildi." });
  } catch (error) {
    res.status(500).json({ message: "Şifre değiştirilemedi.", error: error.message });
  }
};


exports.updateProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Dosya yüklenmedi." });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "Kullanıcı bulunamadı." });

    user.profilePicture = req.file.path; 

    await user.save();

    res.json({ message: "Profil fotoğrafı güncellendi.", profilePicture: user.profilePicture });
  } catch (error) {
    res.status(500).json({ message: "Profil fotoğrafı güncellenemedi.", error: error.message });
  }
};

exports.deleteUserAccount = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) return res.status(404).json({ message: "Kullanıcı bulunamadı." });


    res.json({ message: "Hesabınız başarıyla silindi." });
  } catch (error) {
    res.status(500).json({ message: "Hesap silinemedi.", error: error.message });
  }
};
