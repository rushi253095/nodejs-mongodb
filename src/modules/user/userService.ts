import * as mongoose from "mongoose";
import UserModel from "../../models/userModel";
import Utils from "../../helper/utils";

const ObjectId = mongoose.Types.ObjectId;
class UserService {
  constructor() {
  }
  public checkDuplicate = (data, userId = "") => {
    const cond: any = {};
    if (!Utils.empty(userId)) {
      cond._id = { $ne: userId };
    }
    return UserModel.findOne({ ...data, ...cond });
  }

  public createUser = async (data, updateCreated = false) => {
    if (Utils.empty(data._id)) {
      const user = new UserModel(data);
      return user.save();
    } else {
      if (updateCreated) {
        await mongoose.connection.db.collection('users').update({ _id: ObjectId(data._id) }, { $set: { createdAt: new Date() } });
      }
      return UserModel.findOneAndUpdate({ _id: data._id }, data, { new: true });
    }
  }

  public findUser = async (email) => {

    return UserModel.aggregate([{
      $match: {
        email,
      },
    }]);
  }
}

export default new UserService();
