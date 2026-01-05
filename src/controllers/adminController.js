const getAdminDashboard = async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    try {
        const response = await fetch(`http://localhost:3000/api/players?page=${page}&limit=${limit}`, {
            headers: {
                Cookie: req.headers.cookie
            }
        });

        const data = await response.json();

        const error = req.query.error === 'delete' ? 'Ezin izan da jokalaria ezabatu' : null;

        res.render('admin/index', {
            players: data.data,
            error,
            limit,
            page
        });
    } catch (error) {
        res.render('admin/index', {
            players: [],
            error: 'Errorea jokalariak lortzean',
            limit,
            page
        });
    }
};

const getNewPlayerForm = (req, res) => {
    res.render('admin/newPlayer', { error: null, message: null });
};

const postNewPlayer = async (req, res) => {
    const { id, name, teamId, leagueId } = req.body;
    try {
        const response = await fetch('http://localhost:3000/api/players', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Cookie: req.headers.cookie
            },
            body: JSON.stringify({ id, name, teamId, leagueId })
        });

        let data = await response.json();

        let message = null;
        let error = null;
        if (data.success === false) {
            message = null;
            error = 'Jokalaria jadanik existitzen da';
        } else if (data.success === true) {
            message = 'Jokalaria arrakastaz sortua';
            error = null;
        }

        res.render('admin/newPlayer', { error: error, message: message });
    } catch (error) {
        res.render('admin/newPlayer', { error: error.message, message: null });
    }
};

const getEditPlayerForm = async (req, res) => {
    const { id } = req.params;

    const response = await fetch(`http://localhost:3000/api/players/${id}`, {
        headers: { Cookie: req.headers.cookie }
    });
    const data = await response.json();

    res.render('admin/editPlayer', {
        player: data.data,
        error: null,
        message: null
    });
};

const putEditPlayer = async (req, res) => {
    const { name, teamId, leagueId } = req.body;
    const { id } = req.params;

    try {
        const response = await fetch(`http://localhost:3000/api/players/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Cookie: req.headers.cookie
            },
            body: JSON.stringify({ name, teamId, leagueId })
        });

        let data = await response.json();

        let message = null;
        let error = null;
        if (data.success === false) {
            message = null;
            error = 'Jokalaria ez da existitzen';
        } else if (data.success === true) {
            message = 'Jokalaria arrakastaz aldatua';
            error = null;
        }

        res.render('admin/editPlayer', { player: { id, name, teamId, leagueId }, error: error, message: message });
    } catch (error) {
        res.render('admin/editPlayer', { player: { id, name, teamId, leagueId }, error: error.message, message: null });
    }
};

const deletePlayer = async (req, res) => {
    const { id } = req.params;

    try {
        const response = await fetch(`http://localhost:3000/api/players/${id}`, {
            method: 'DELETE',
            headers: {
                Cookie: req.headers.cookie
            }
        });

        let data = await response.json();

        if (data.success === false) {
            res.render('admin/deletePlayer', { error: 'Ezin izan da jokalaria ezabatu', message: null });
        } else if (data.success === true) {
            res.render('admin/deletePlayer', { error: null, message: 'Jokalaria arrakastaz ezabatua' });
        }
    } catch (error) {
        res.redirect('/admin?error=delete');
    }
}

module.exports = { getAdminDashboard, getNewPlayerForm, postNewPlayer, getEditPlayerForm, putEditPlayer, deletePlayer }