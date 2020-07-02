const user = (req, res, next) => {
    res.json({
        userName: 'Ramki',
        id: 333
    })
}

module.exports = user;