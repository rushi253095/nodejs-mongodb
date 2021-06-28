import Utils from "./utils";
import modelConstants from "../constants/modelConstants";
import commonConstants from "../constants/commonConstants";
class ModelUtils {
    constructor() { }

    public paginationCount = async (Model, condition) => {
        const dataCount = await Model.countDocuments(condition);
        const totalPages = Math.ceil(dataCount / commonConstants.limit);
        return { dataCount, totalPages, maxLimit: commonConstants.limit };
    }

    public findQuery = async (Model, condition, fields, page = -1, sort = null, limit = null) => {
        let options: any = {};
        if (page >= 0) {
            options = {
                skip: commonConstants.limit * page,
                limit: commonConstants.limit,
            };
        }
        if (!Utils.empty(limit)) {
            options = {
                skip: limit * page,
                limit,
            };
        }
        if (!Utils.empty(sort)) {
            options.sort = { ...sort };
        }
        return Model.find(condition, fields, options);
    }

    public paginationAggreCount = async (Model, condition, limit = commonConstants.limit) => {
        let count = 0;
        const dataCount = await Model.aggregate([...condition, { $group: { _id: null, n: { $sum: 1 } } }]);

        if (!Utils.empty(dataCount)) {
            count = dataCount[0].n;
        }
        const totalPages = Math.ceil(count / limit);
        return { dataCount: count, totalPages, maxLimit: limit };
    }

    public aggregateQuery = async (Model, conditionAggre, page = -1, pageLimit = null) => {
        let limit = [];
        if (page >= 0) {
            limit = [{
                $skip: commonConstants.limit * page,
            }, {
                $limit: commonConstants.limit,
            }];
        }
        if (!Utils.empty(pageLimit)) {
            limit = [{
                $skip: pageLimit * page,
            }, {
                $limit: pageLimit,
            }];
        }
        return Model.aggregate([...conditionAggre, ...limit]);
    }

    public commonLookup = async (nameAs, from, foreignField, localField, unwind = true, nullArrays = true) => {
        const commonCondition: any = [{
            $lookup: { from, as: nameAs, localField, foreignField },
        }];

        if (unwind) {
            commonCondition.push({ $unwind: { path: `$${nameAs}`, preserveNullAndEmptyArrays: nullArrays } });
        }

        return commonCondition;
    }

    public sumCount = async (andCond = [], status = "") => {
        if (andCond.length === 0) {
            andCond = [{ $and: [{ $eq: ["$status", status] }] }];
        }
        const sumCondition: any = { $sum: { $cond: [...andCond, 1, 0] } };

        return sumCondition;
    }

    public getCount = async (Model, match) => {
        let status = "";
        const sumAppCount = await this.sumCount([], modelConstants.POST_STATUS[1]);
        const sumPenCount = await this.sumCount([], modelConstants.POST_STATUS[0]);
        const sumRejCount = await this.sumCount([], modelConstants.POST_STATUS[2]);
        const statusCount = await Model.aggregate([{
            $match: match,
        }, {
            $group: {
                _id: null,
                rejectCount: sumRejCount,
                approveCount: sumAppCount,
                pendingCount: sumPenCount,
            },
        }]);
        if (statusCount[0].pendingCount > 0) {
            status = modelConstants.POST_STATUS[0];
        } else if (statusCount[0].rejectCount > 0) {
            status = modelConstants.POST_STATUS[2];
        } else if (statusCount[0].approveCount > 0) {
            status = modelConstants.POST_STATUS[1];
        }
        return status;
    }
}

export default new ModelUtils();
