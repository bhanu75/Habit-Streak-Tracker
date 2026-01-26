export interface MotivationalMessage {
  quote: string;
  cta: string;
}

export const MOTIVATIONAL_MESSAGES: MotivationalMessage[] = [
  {
    quote: "Today you improved by 1%. Tomorrow you'll be unstoppable.",
    cta: "Keep the streak alive 🔥"
  },
  {
    quote: "Discipline isn't about mood, it's about commitment.",
    cta: "Next check-in tomorrow ✅"
  },
  {
    quote: "Those who do it daily, win eventually.",
    cta: "Stay consistent 💪"
  },
  {
    quote: "Small steps create big results.",
    cta: "One more day, one more win 🏆"
  },
  {
    quote: "Your habits shape your identity.",
    cta: "Choose your identity daily 🎯"
  },
  {
    quote: "Today you didn't start… you continued. That's power.",
    cta: "Continue tomorrow 🔥"
  },
  {
    quote: "Motivation comes and goes. Routines stay.",
    cta: "Lock your routine—check-in daily 🔁"
  },
  {
    quote: "The future belongs to those who don't quit today.",
    cta: "Don't stop now ⚡"
  },
  {
    quote: "Consistency is silent. Results are loud.",
    cta: "Build your streak 💯"
  },
  {
    quote: "You shape your life with daily votes.",
    cta: "Vote in your favor tomorrow 🗳️"
  },
  {
    quote: "Today's effort might be small, but the direction is huge.",
    cta: "Keep the direction—check-in again 🧭"
  },
  {
    quote: "Every check-in is a brick. You're building your empire.",
    cta: "One more brick tomorrow 🧱"
  },
  {
    quote: "You become strong when no one's watching.",
    cta: "Show up tomorrow 👁️"
  },
  {
    quote: "Excuses are easy. Growth is hard. You chose growth.",
    cta: "Repeat tomorrow 🌱"
  },
  {
    quote: "Control yourself, win the world.",
    cta: "Self-control streak continues ✅"
  },
  {
    quote: "One day's work is inspiration. Daily work is transformation.",
    cta: "Transform yourself—check-in daily 🦋"
  },
  {
    quote: "Today you respected your future self.",
    cta: "Future-you wants another check-in 🔮"
  },
  {
    quote: "Today you proved: you're serious.",
    cta: "Prove it again tomorrow 💪"
  },
  {
    quote: "Great people aren't perfect—they're consistent.",
    cta: "Consistency mode: ON 🔁"
  },
  {
    quote: "When you win daily, life gets better automatically.",
    cta: "Daily win repeat 🏆"
  },
  {
    quote: "You don't need speed, you need direction.",
    cta: "Direction locked—check-in again 🧭"
  },
  {
    quote: "Your effort builds you, not your mood.",
    cta: "Mood or not—check-in 💪"
  },
  {
    quote: "Every check-in is a promise: 'I won't give up.'",
    cta: "Promise continues tomorrow 🤝"
  },
  {
    quote: "Today you ignored comfort. Respect.",
    cta: "Don't let comfort win tomorrow 🛋️"
  },
  {
    quote: "You're building the best version of yourself.",
    cta: "Build daily—check-in again 🏗️"
  },
  {
    quote: "Greatness secret: doing boring things daily.",
    cta: "Boring today = legendary tomorrow 👑"
  },
  {
    quote: "Your decisions write your destiny.",
    cta: "Write destiny tomorrow 📝"
  },
  {
    quote: "Today you turned 'later' into 'now'.",
    cta: "Now again tomorrow ⚡"
  },
  {
    quote: "Those who improve daily reach another level.",
    cta: "Level up daily 🔥"
  },
  {
    quote: "Every daily check-in is a win.",
    cta: "Win again tomorrow 🏆"
  },
  {
    quote: "Your consistency will become your confidence.",
    cta: "Build confidence—check-in again 💪"
  },
  {
    quote: "Today you made your story better.",
    cta: "Write another page tomorrow 📖"
  },
  {
    quote: "Success doesn't come in one day—it comes daily.",
    cta: "Come daily—check-in 🔁"
  },
  {
    quote: "You don't need to be perfect, just present.",
    cta: "Be present tomorrow ✅"
  },
  {
    quote: "Today's discipline is tomorrow's freedom.",
    cta: "Streak = freedom 🔥"
  },
  {
    quote: "Your habits are your life's steering wheel.",
    cta: "Keep steering—check-in again 🚗"
  },
  {
    quote: "Today you didn't disappoint yourself.",
    cta: "Feel proud tomorrow 💛"
  },
  {
    quote: "Hard days make strong people.",
    cta: "Get stronger—check-in tomorrow 💪"
  },
  {
    quote: "When you win daily, you learn to trust yourself.",
    cta: "Trust yourself—continue 🤝"
  },
  {
    quote: "You're becoming who you wanted to be.",
    cta: "Don't stop now 🔥"
  },
  {
    quote: "Today you chose discipline. You're rare.",
    cta: "Rare people check-in daily 💎"
  },
  {
    quote: "One habit change, whole life changes.",
    cta: "Change continues tomorrow 🔄"
  },
  {
    quote: "Today's small action is tomorrow's big result.",
    cta: "Big result loading… check-in again 📊"
  },
  {
    quote: "Talent or not, consistency beats everything.",
    cta: "Consistency streak on 💪"
  },
  {
    quote: "Today you chose to stay loyal to yourself.",
    cta: "Loyalty repeats tomorrow 🤝"
  },
  {
    quote: "Your inner champion is built by routine.",
    cta: "Champion mode: ON 🏆"
  },
  {
    quote: "You just can't quit. That's it.",
    cta: "See you tomorrow 🔁"
  },
  {
    quote: "Today you said 'no' to excuses.",
    cta: "Say 'no' again tomorrow 🚫"
  },
  {
    quote: "Your journey might be slow, but you're going right.",
    cta: "Right direction—check-in again 🧭"
  },
  {
    quote: "Today you took a small win. Tomorrow a bigger one.",
    cta: "See you tomorrow—ready? ✅"
  },
];

/**
 * Get a random motivational message
 */
export function getRandomMotivationalMessage(): MotivationalMessage {
  const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length);
  return MOTIVATIONAL_MESSAGES[randomIndex];
}

/**
 * Get message based on streak milestone
 */
export function getStreakMessage(streak: number): MotivationalMessage {
  if (streak === 1) {
    return {
      quote: "First step taken! The hardest part is done.",
      cta: "Keep the momentum going 🔥"
    };
  } else if (streak === 7) {
    return {
      quote: "One week strong! You're building something real.",
      cta: "Week 2 starts now 💪"
    };
  } else if (streak === 21) {
    return {
      quote: "21 days! You're forming a real habit now.",
      cta: "This is just the beginning 🌟"
    };
  } else if (streak === 30) {
    return {
      quote: "One month! You've proven you can do this.",
      cta: "Unstoppable mode activated 🚀"
    };
  } else if (streak === 100) {
    return {
      quote: "100 days! You're in the top 1% of people.",
      cta: "Legend status unlocked 👑"
    };
  } else {
    return getRandomMotivationalMessage();
  }
}
