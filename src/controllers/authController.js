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
// GET /login
exports.getLoginView = (req, res) => {
    res.render('auth/login', { error: null });
}

// POST /login
exports.login = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email});

        if (!user) {
            res.render('auth/login', { error: "Kredentzialak ez dira baliozkoak" });
            return;
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            res.render('auth/login', { error: "Kredentzialak ez dira baliozkoak" });
            return;
        }

        req.session.userId = {
            id: user._id,
            role: user.role
        };

        res.redirect('/admin');
    } catch (error) {
        res.render('auth/login', { error: "Errorea saioa hastean" });
    }
}

// GET /logout
exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.status(200).json({message: "Saioa ondo itxi da"});
    });
}

exports.oauthLogin = async (req, res) => {
    try{
        const profile = req.user;
        let email = profile.emails?.find(e => e.primary)?.value || profile.emails?.[0]?.value || null;
        if(!email){
            email = `${profile.username}@github.local`;
        }

        let user = await User.findOne({email});

        if (!user){
            let role = 'user';
            const existingUser = await User.findOne();
            if(!existingUser){
                role = 'admin';
            }

            user = new User({
                name : profile.displayName || profile.username || 'Oauth',
                lastName: profile.provider,
                email,
                role,
                oauthProvider: profile.provider,
                oauthId: profile.id
            });

            await user.save();
        }

        req.session.userId = {
            id: user._id.toString(),
            role: user.role
        };

        res.redirect('/admin');
    }catch (error){
        console.error('Oauth login error: ' , error);
        res.redirect('/auth/login');
    }
}
