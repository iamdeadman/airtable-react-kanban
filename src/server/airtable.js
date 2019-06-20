import _ from "lodash";
import AIRTABLE from 'airtable';
import shortid from "shortid";

const appendAttributes = list => list.map(card => ({ color: "white", ...card }));

const BUGS_ISSUES_BASE = {
    BASE_ID: "appmeXBK72YLuGeFH",
    BASE_TITLE: "Bugs & Issues",
    BASE_VIEW: "Bugs by Priority"
};

AIRTABLE.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: ''
});

const AIRTABLE_BASE = AIRTABLE.base(BUGS_ISSUES_BASE.BASE_ID);

export default {
    getBoardData(userId, cb) {
        const all_records = [];
        AIRTABLE_BASE(BUGS_ISSUES_BASE.BASE_TITLE).select({
            // Selecting the first 3 records in Bugs by Priority:
            maxRecords: 100,
            view: BUGS_ISSUES_BASE.BASE_VIEW
        }).eachPage(function page(records, fetchNextPage) {
            // This function (`page`) will get called for each page of records.

            records.forEach(function(record) {
                all_records.push(record);
            });

            // To fetch the next page of records, call `fetchNextPage`.
            // If there are more records, `page` will get called again.
            // If there are no more records, `done` will get called.
            fetchNextPage();

        }, function done(err) {

            const DEFAULT_RESPONSE = {
                _id: BUGS_ISSUES_BASE.BASE_ID,
                title: BUGS_ISSUES_BASE.BASE_TITLE,
                color: "white",
                lists: [],
                users: userId ? [userId] : []
            };

            if (err) { console.error(err); cb(DEFAULT_RESPONSE); }
            else {
                const priority_grouped_records = _.groupBy(all_records, function(record){
                    return record.get("Priority") != null ? record.get("Priority") : "uncategorized";
                });

                let uncategorized_records = 0;

                _.forEach(priority_grouped_records, function (records, priority) {
                    const priority_cards = [];
                    if(priority.toLowerCase() === "uncategorized") uncategorized_records = records.length;
                    records.forEach(function(record){
                        priority_cards.push({
                            _id: record.id, title: record.get("Name"), text: record.get("Description"),
                            date: record.get("Opened Date & Time (GMT)"), priority: record.get("Priority")
                        });
                    });
                    DEFAULT_RESPONSE.lists.push({_id: shortid.generate(), title: priority, cards: appendAttributes(priority_cards)});
                });

                if(uncategorized_records === 0) {
                    DEFAULT_RESPONSE.lists.unshift({_id: shortid.generate(), title: "uncategorized", cards: []});
                }

                cb(DEFAULT_RESPONSE);
            }
        });
    },

    addCardData(payload) {
        return new Promise((resolve, reject) => {
            AIRTABLE_BASE(BUGS_ISSUES_BASE.BASE_TITLE).create(payload, (err, record) => {
                if(err != null) return reject(err);
                else return resolve(record.id);
            });
        });
    },

    updateCardData(cardId, payload) {
        return new Promise((resolve, reject) => {
            AIRTABLE_BASE(BUGS_ISSUES_BASE.BASE_TITLE).update(cardId, payload, (err, record) => {
                if(err != null) return reject(err);
                else return resolve(record);
            });
        });
    },

    deleteCardData(cardId) {
        return new Promise((resolve, reject) => {
            AIRTABLE_BASE(BUGS_ISSUES_BASE.BASE_TITLE).destroy(cardId, (err, record) => {
                if(err != null) return reject(err);
                else return resolve(record);
            });
        });
    }
}