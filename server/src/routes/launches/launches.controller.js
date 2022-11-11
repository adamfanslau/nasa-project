const {
    getAllLaunches,
    addNewLaunch,
    abortLaunchById,
    existsLaunchWithId
} = require('../../models/launches.model');

function httpGetAllLaunches (req, res) {
    return res.status(200).json(getAllLaunches());
}

function httpAddNewLaunch (req, res) {
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

    addNewLaunch(launch);
    return res.status(201).json(launch);
}

function httpAbortLaunch (req, res) {
    const launchId = +req.params.id;
    if (existsLaunchWithId(launchId)) {
        return res.status(200).json(abortLaunchById(launchId));
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