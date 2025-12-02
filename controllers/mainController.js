//callback function for landing page
exports.index = (req, res) => {
    res.render('index');
};

//callback function for about page
exports.about = (req, res) => {
    res.render('about');
};

//callback function for contact page
exports.contact = (req, res) => {
    res.render('contact');
};
