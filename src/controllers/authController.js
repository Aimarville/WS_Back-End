const User = require("../models/User");

// POST /register
exports.register = async (req, res) => {
    const {name, lastName, email, password} = req.body;
    try {
        const existingUser = await User.findOne({email});

        if (existingUser) {
            return res.status(400).json({error: "Erabiltzailea jadanik existitzen da"});
        }

        let role = 'user';
        const u = await User.findOne();
        if (!u) {
            role = 'admin';
        }

        const user = new User({name, lastName, email, password, role});
        console.log('Erabiltzailea erregistratzen:', {name, lastName, email, role});
        await user.save();

        res.status(201).json({message: "Erabiltzailea ondo erregistratu da"});
    }catch (error) {
        console.error('Errorea erabiltzailea erregistratzean:', error);
        res.status(500).json({error: "Errorea erabiltzailea erregistratzean"});
    }
}

// POST /login
exports.login = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email});

        if (!user) {
            return res.status(400).json({error: "Kredentzialak ez dira baliozkoak"});
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({error: "Kredentzialak ez dira baliozkoak"});
        }

        req.session.userId = {
            id: user._id,
            role: user.role
        };

        res.status(200).json({message: "Ondo logeatuta"});
    } catch (error) {
        res.status(500).json({error: "Errorea saioa hastean"});
    }
}

// GET /logout
exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.status(200).json({message: "Saioa ondo itxi da"});
    });
}