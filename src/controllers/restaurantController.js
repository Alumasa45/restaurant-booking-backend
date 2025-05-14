exports.getRestaurants = (req, res) => {
    res.send("List of restaurants");
};

exports.getRestaurantById = (req, res) => {
    res.send(`Restaurant details for ID: ${req.params.id}`);
};
