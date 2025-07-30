const questions = [
    {
        question: 'What activity do you do in your free time?',
        answers: [
            { text: 'Create. Inspire. Bring light to a dull world.', weights: { creative: 25, chill: 15, angry: 0, suspicious: 0 } },
            { text: 'Relax and chill', weights: { creative: 0, chill: 20, angry: 0, suspicious: 0 } },
            { text: 'Get angry at things', weights: { creative: 0, chill: 0, angry: 15, suspicious: 0 } },
            { text: 'Question everything', weights: { creative: 0, chill: 0, angry: 0, suspicious: 15 } }
        ]
    },
    {
        question: 'If someone offered you some fent would you hit it?',
        answers: [
            { text: 'Yes', weights: { creative: 0, chill: 0, angry: 0, suspicious: 0, golden: 10 } },
            { text: 'No', weights: { creative: 5, chill: 20, angry: 0, suspicious: 0 } }
        ]
    },
    {
        question: 'What is your opinion on the government?',
        answers: [
            { text: 'They are corrupt', weights: { creative: 0, chill: 0, angry: 15, suspicious: 15 } },
            { text: 'They are doing their best', weights: { creative: 10, chill: 15, angry: 0, suspicious: 0 } },
            { text: 'I like them', weights: { creative: 5, chill: 10, angry: 0, suspicious: 0 } },
            { text: '[REDACTED]', weights: { creative: 0, chill: 0, angry: 30, suspicious: 15 } },
            { text: 'They are controlling my brain with a satellite', weights: { creative: 0, chill: 0, angry: 50, suspicious: 70 } }
        ]
    },
    {
        question: 'Someone wants to race you on foot what do you do?',
        answers: [
            { text: 'I will have them place money on it and rob them blind', weights: { creative: 0, chill: 0, angry: 0, suspicious: 0, golden: 10 } },
            { text: 'I will tell them no thats stupid and walk away', weights: { creative: 0, chill: 15, angry: 20, suspicious: 0 } },
            { text: 'I will accept the challenge and race them', weights: { creative: 5, chill: 10, angry: 0, suspicious: 0 } },
            { text: 'I will challenge them to a fist fight instead', weights: { creative: 15, chill: 0, angry: 15, suspicious: 0 } }
        ]
    },
    {
        question: "You're coming up to a speed bump, what do you do?",
        answers: [
            { text: 'I will slow down and go over it', weights: { creative: 0, chill: 20, angry: 0, suspicious: 0 } },
            { text: 'I will speed up and go over it', weights: { creative: 0, chill: 0, angry: 15, suspicious: 0 } },
            { text: 'I will stop and get out of the car', weights: { creative: 5, chill: 0, angry: 0, suspicious: 15 } },
            { text: 'I will hit that mf at 100mph. get fucked suspension.', weights: { creative: 0, chill: 0, angry: 0, suspicious: 0, golden: 10 } }
        ]
    },
    {
        question: "Your want to download a movie/some cool music, what do you do?",
        answers: [
            { text: 'I will use a torrent', weights: { creative: 30, chill: 10, angry: 0, suspicious: 0 } },
            { text: 'I will stream it online', weights: { creative: 0, chill: 25, angry: 0, suspicious: 0 } },
            { text: 'm0viezN0wwwww.ru/jkl/u/movies?utm_source=viruslol looks good wheres the mf download button', weights: { creative: 0, chill: 0, angry: 0, suspicious: 0, golden: 10 } }
        ]
    },
    {
        question: "What do you think about cigarettes?",
        answers: [
            { text: 'They are bad for you', weights: { creative: 0, chill: 15, angry: 0, suspicious: 0 } },
            { text: 'They are good for you', weights: { creative: 20, chill: 0, angry: 0, suspicious: 15 } },
            { text: 'I love smoking them and I am 13', weights: { creative: 0, chill: 0, angry: 0, suspicious: 0, golden: 10 } },
            { text: 'I dont smoke them', weights: { creative: 15, chill: 20, angry: 0, suspicious: 0 } },
        ]
    },
    {
        question: "What do you think about the current state of the world?",
        answers: [
            { text: 'It is a mess', weights: { creative: 0, chill: 0, angry: 20, suspicious: 15 } },
            { text: 'It is getting better', weights: { creative: 10, chill: 20, angry: 0, suspicious: 0 } },
            { text: 'I dont care', weights: { creative: 5, chill: 15, angry: 0, suspicious: 0 } },
            { text: 'I am the only one who can fix it', weights: { creative: 30, chill: 0, angry: 15, suspicious: 20 } }
        ]
    },
    {
        question: "What is your opinion on trevor?",
        answers: [
            { text: 'chill I guess', weights: { creative: 0, chill: 20, angry: 0, suspicious: 0 } },
            { text: 'we gotta kill this guy', weights: { creative: 0, chill: 0, angry: 20, suspicious: 15 } },
            { text: 'put him in my "would" slideshow', weights: { creative: 0, chill: 0, angry: 0, suspicious: 0, golden: 10 } },
        ]
    },
    {
        question: "You see pookie in the street while driving, what do you do?",
        answers: [
            { text: 'I will run pookie over', weights: { creative: 0, chill: 0, angry: 20, suspicious: 0 } },
            { text: '"Theres room on my lap pooks aaahhhaaaa"', weights: { creative: 0, chill: 0, angry: 0, suspicious: 0, golden: 10 } },
            { text: 'I will ignore pookie', weights: { creative: 5, chill: 15, angry: 0, suspicious: 0 } },
            { text: 'I will stop and give pookie a ride', weights: { creative: 25, chill: 10, angry: 0, suspicious: 0 } }
        ]
    }

]

export default questions