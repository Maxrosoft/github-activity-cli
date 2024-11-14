#!/usr/bin/env node

function generateLines(data) {
    const lines = {};

    const addCountableLine = (eventType, message) => {
        if (!lines[eventType]) {
            lines[eventType] = {};
        }

        if (lines[eventType].count === undefined) {
            lines[eventType].count = 0;
        }
        lines[eventType].type = "countable";
        lines[eventType].count++;
        lines[eventType].message = message;
    };

    const addSpecificLine = (eventType, message, repo) => {
        if (!lines[eventType]) {
            lines[eventType] = {};
        }

        if (!lines[eventType].messages) {
            lines[eventType].messages = [];
        }

        lines[eventType].type = "specific";
        lines[eventType].messages.push(`- ${message}: ${repo}`);
    };

    for (let e of data) {
        switch (e.type) {
            case "CreateEvent":
                addSpecificLine(e.type, "Created a new repository", e.repo.name);
                break;
            case "DeleteEvent":
                addSpecificLine(e.type, "Deleted repository", e.repo.name);
                break;
            case "ForkEvent":
                addSpecificLine(e.type, "Forked a repository", e.repo.name);
                break;
            case "GollumEvent":
                addSpecificLine(e.type, "Edited repository wiki", e.repo.name);
                break;
            case "IssueCommentEvent":
                addSpecificLine(e.type, "Commented on an issue", e.repo.name);
                break;
            case "IssuesEvent":
                addSpecificLine(e.type, "Created a new issue", e.repo.name);
                break;
            case "MemberEvent":
                addSpecificLine(e.type, "Changed repository members", e.repo.name);
                break;
            case "PublicEvent":
                addSpecificLine(e.type, "Made repository public", e.repo.name);
                break;
            case "PullRequestEvent":
                addSpecificLine(e.type, "Created/updated a pull request", e.repo.name);
                break;
            case "PullRequestReviewEvent":
                addSpecificLine(e.type, "Reviewed a pull request", e.repo.name);
                break;
            case "PullRequestReviewCommentEvent":
                addSpecificLine(e.type, "Commented on a pull request review", e.repo.name);
                break;
            case "PullRequestReviewThreadEvent":
                addSpecificLine(e.type, "Started/updated a review thread", e.repo.name);
                break;
            case "PushEvent":
                addCountableLine(e.type, "Pushed commits to a repository");
                break;
            case "ReleaseEvent":
                addSpecificLine(e.type, "Published a new release", e.repo.name);
                break;
            case "SponsorshipEvent":
                addSpecificLine(e.type, "Sponsored/received sponsorship", e.repo.name);
                break;
            case "WatchEvent":
                addCountableLine(e.type, "Starred a repository");
                break;
            default:
                console.log(`Unknown event type: ${e.type}`);
        }
    }

    return lines;
}


function dislpayLines(lines) {
    for (let e in lines) {
        if (lines[e].type === "countable") {
            console.log(`- ${lines[e].message} (${lines[e].count})`);
        } else if (lines[e].type === "specific") {
            for (let message of lines[e].messages) {
                console.log(message);
            }
        }
    }
}

const username = process.argv[2];
if (!username) {
    throw new Error("Provide with username");
}

fetch(`https://api.github.com/users/${username}/events`)
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        dislpayLines(generateLines(data));
    });
