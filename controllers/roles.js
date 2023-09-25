const Rol = require("../model/rol");

const rolPost = (req, res) => {

    const { rol } = req.body;
    const rolData = new Rol({rol});
    
    rolData.save();

    res.json({
        msg:'Registro de rol',
        rolData
    });
}

module.exports = {
    rolPost
}