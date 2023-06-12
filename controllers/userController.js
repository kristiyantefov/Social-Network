const { User } = require("../models");

module.exports = {
  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })
        .populate("thoughts")
        .populate("friends");
      res.json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndRemove({ _id: req.params.userId });
      res.status(200).json(user);
      if (!user) {
        return res.status(404).json({ message: "User doesn't exist." });
      }
    } catch (error) {
      res.status(500).json(err);
    }
  },
  async updateUser(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
      );
      
      if (!user) {
        return res.status(404).json({ message: "User doesn't exist." });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
      console.error(error);
    }
  },
  async deleteFriend(req, res) {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId }},
            { runValidators: true, new: true },
        );

        if(!user) {
            return res.status(404).json({ message: 'No user with that ID' });
        };
       
        res.json(user);
    } catch (error) {
        return res.status(500).json(error);
    }
},
async addFriend(req, res) {
    try {
        const user = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: req.params.friendId }},
            { runValidators: true, new: true }
        );

        if(!user) {
            return res.status(404).json({ message: 'No user with that ID' });;
        };

        res.json(user);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
}
};
