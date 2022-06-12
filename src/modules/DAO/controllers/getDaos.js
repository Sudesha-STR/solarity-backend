import { errorResponse, successResponse } from "../../../utils";
import DaoModel from "../model";
import { getDaoMemberships } from "../helpers";

export const getDaosController = async (req, res) => {
  try {
    let {
      session: { userId },
      query: { member, term },
    } = req;
    const findOptions = {};
    if (member && userId) {
      const user = await req.profile();
      let memberIds = [];
      if (user.solanaAddress) {
        memberIds = await getDaoMemberships(user.solanaAddress);
      }
      findOptions["_id"] = {
        $in: memberIds,
      };
    } else {
      if (term) {
        const searchRegex = new RegExp(`.*${term}.*`, "i");
        findOptions["$or"] = [
          {
            symbol: { $regex: searchRegex },
          },
          {
            name: { $regex: searchRegex },
          },
        ];
      }
    }
    const daos = await DaoModel.aggregate([
      {
        $match: findOptions,
      },
      {
        $addFields: { profileImageLink: "$profileImage.link" },
      },
      {
        $project: { name: 1, symbol: 1, profileImageLink: 1 },
      },
      {
        $limit: 20,
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);
    return successResponse({ res, response: { data: daos } });
  } catch (err) {
    return errorResponse({ res, err });
  }
};
