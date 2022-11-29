const {
    getAllLaunches,
    scheduleNewLaunch,
    abortLaunchById,
    existsLaunchWithId
} = require('../../models/launches.model');

const {
    getPagination
} = require('../../services/query');

async function httpGetAllLaunches (req, res) {
    const { skip, limit } = getPagination(req.query);
    const launches = await getAllLaunches(skip, limit)
    return res.status(200).json(launches);
}

async function httpAddNewLaunch (req, res) {
    const launch = req.body;

    if (!launch.mission || !launch.rocket || !launch.launchDate
        || !launch.target) {
        return res.status(400).json({
            error: 'Missing required launch property!'
        });
    }

    launch.launchDate = new Date(launch.launchDate);

    if (isNaN(launch.launchDate)) {
        return res.status(400).json({
            error: 'Invalid date format!'
        });
    }

    await scheduleNewLaunch(launch);
    return res.status(201).json(launch);
}

async function httpAbortLaunch (req, res) {
    const launchId = +req.params.id;
    if (await existsLaunchWithId(launchId)) {
        const aborted = await abortLaunchById(launchId);
        if (!aborted) {
            return res.status(400).json({
                error: 'Launch not aborted!'
            });
        } else {
            return res.status(200).json({
                aborted
            });
        }
    } else {
        return res.status(404).json({
            error: `Launch with id ${launchId} does not exist!`
        });
    }
    
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch
}