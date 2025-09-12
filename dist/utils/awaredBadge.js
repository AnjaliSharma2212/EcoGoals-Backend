"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAndAwardBadge = exports.checkAndAwardLevel = void 0;
const checkAndAwardLevel = (habit) => {
    let newBadge = null;
    // 🎯 Define tiers
    const tiers = [
        {
            streak: 7,
            level: "Bronze",
            message: "🔥 Bronze unlocked! You’re building momentum!",
        },
        {
            streak: 30,
            level: "Silver",
            message: "💪 Silver unlocked! Amazing dedication!",
        },
        {
            streak: 100,
            level: "Gold",
            message: "🏆 Gold unlocked! You’re unstoppable!",
        },
    ];
    // Check which tier matches current streak
    const tier = tiers.find((t) => habit.streak === t.streak);
    if (tier) {
        // Create badge
        newBadge = {
            title: `${tier.level} Milestone (${tier.streak} Days)`,
            message: tier.message,
        };
        // Prevent duplicate
        const alreadyAwarded = newBadge
            ? habit.badges.some((b) => b.title === newBadge.title)
            : false;
        if (newBadge && !alreadyAwarded) {
            habit.badges.push(newBadge);
            habit.level = tier.level; // Update level
        }
    }
    return newBadge;
};
exports.checkAndAwardLevel = checkAndAwardLevel;
const checkAndAwardBadge = (habit) => {
    if (habit.streak > 0 && habit.streak % 7 === 0) {
        const badge = {
            title: `${habit.streak}-Day Streak!`,
            message: `🔥 You’ve crushed ${habit.streak} days in a row! Amazing dedication 🚀`,
        };
        const alreadyAwarded = habit.badges.some((b) => b.title === badge.title);
        if (!alreadyAwarded) {
            habit.badges.push(badge);
            return badge; // return so we can notify frontend
        }
    }
    return null;
};
exports.checkAndAwardBadge = checkAndAwardBadge;
