import airtable from "./airtable";

// Generate the initial showcase board that every user and guest gets when they first log in
const createWelcomeBoard = (userId, cb) => {
    airtable.getBoardData(userId, cb);
};

export default createWelcomeBoard;
