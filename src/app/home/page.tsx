import Link from "next/link";

export default function Home() {
    return (
        <div className="flex-1 mx-auto px-1 sm:px-4">
                <div className="relative w-full flex flex-col items-center">
                    <div className="title-wrapper space-y-2">
                        <h2 className="main-title fade-in delay-0 translate-x-[30%] sm:translate-x-[40%]">Tennis</h2>
                        <h2 className="main-title fade-in delay-1 translate-x-[-20%] sm:translate-x-[-30%]">Tournament</h2>
                        <h2 className="main-title fade-in delay-2 translate-x-[40%] sm:translate-x-[50%]">Creator</h2>
                    </div>
                    <div className="racket-cross-wrapper-lg">
                        <img src="/assets/images/racket-red.svg" alt="" />
                        <img src="/assets/images/racket-blue.svg" alt="" />
                    </div>
                    <div className="my-4">
                        <div className="flex flex-col md:flex-row gap-2.5 w-full md:w-2xl text-center my-2.5">
                            <Link href="home/auth/sign-up" className="submit">Register</Link>
                            <Link href="/dashboard" className="submit">Login</Link>
                        </div>
                        <div className="flex flex-col md:flex-row gap-2.5 w-full md:w-2xl text-center my-2.5 ">
                            <Link href="home/generate-matches" className="submit">Quick Generate</Link>
                        </div>
                    </div>
                </div>
            
            <div className="flex flex-col gap-2.5">
                <div className="flex flex-col gap-10">
                    <About />
                    <Host />
                    <Join />
                    <AboutTheDev />
                </div>
            </div>
        </div>
    )
}

function About() {
    return (
        <div className="standard-container bg-slate-200/75 justify-between flex flex-col">
            <div>
                <h3 className="home-subtitle text-center">About</h3>
                <div className="flex flex-col gap-1.5 text-xl font-bold">
                    <p>
                        This is a hobby application built by a single developer to ease the creation and admin of large tennis tournaments. Organising a tennis 
                        tournament for a large group of people, like a club, can be time-consuming and stressful. <i>Tennis Tournament Creator</i> allows hosts
                        to create tournaments and then allow players to join, see their matches, and submit scores. It also automates the process of creating 
                        teams, matches, and tournament brackets, so hosts can focus on overseeing the tournament, rather than working out complicated tournament 
                        bracket structures. 
                    </p>
                    <p>
                        This is a free and open-source application - there are currently no paid features.
                    </p>
                    <p>
                        If you need to host a tournament or you want to join an existing tournament, you can read more about this 
                        below. Either way, start by <Link href="/home/auth/sign-up">registering</Link> now!
                    </p>
                </div>
            </div>
        </div>
    )
}

function Host() {
    return (
        <div className="standard-container pb-0! text-white! bg-slate-950/75 md:text-right justify-between flex flex-col">
            <div>
                <h3 className="home-subtitle">Host Tournaments</h3>
                <div className="flex items-center gap-5">
                    <img src="https://res.cloudinary.com/divlee1zx/image/upload/v1748732958/view-tennis-player-with-digital-art-style-effect_guhlk5.png" alt="" className="hidden xl:block h-96" />
                    <div className="my-2.5 self-start flex flex-col gap-1.5 text-xl font-bold">
                        <p>
                            <i>Tennis Tournament Creator</i> is designed to make running tournaments far easier for the host. After you create an account, you can create
                            a tournament and select what categories you want to be included along with some other options. You'll then be given a code which you can share 
                            with your club or potential players and they can sign up using this code.
                        </p>
                        <p>
                            Then, you can keep track of who joins and, once you are happy with signings, you can close the tournament. The app allows you to automate the 
                            creation of teams (through random selection, but taking into account seeded players if applicable) and the creation of tournament brackets for 
                            each category. This can be done based on players' rankings or completely randomly.
                        </p>
                        <p>Click here to learn more about how teams are created and brackets for categories are generated.</p>
                        <p>
                            Now the tournament is ready! Players can sign in and view their next matches (along with the current results) and submit their scores. You can learn 
                            more about how this works for players below. Note that hosts can also join up as players for their own tournaments.
                        </p>
                    </div>
                </div>
            </div>
        </div>

    )
}

function Join() {
    return (
        <div className="standard-container bg-slate-200/75 justify-between flex flex-col">
            <h3 className="home-subtitle">Join Existing Tournaments</h3>
            <div className="flex items-center gap-5">
                <div className="my-2.5 self-start flex flex-col gap-1.5 text-xl font-bold">
                    <p>
                        <i>Tennis Tournament Creator</i> gives players an easy way to view and update their own matches and see the results of their current 
                        tournament.
                    </p>
                    <p>
                        If a host has already set up a tournament, they will be able to share a tournament code with you which you'll be able to use to join 
                        it. Once the host has created the teams and matches, you'll be able to view your matches, update existing scores, and see the results 
                        of other categories in your tournament. 
                    </p>
                    <p>
                        You can host and play multiple tournaments at the same time - and even view your old tournaments.
                    </p>
                    <p>
                        <i>Tennis Tournament Creator</i> is designed to make the role of both hosts and players giving the power of registration and updating 
                        scores to you, the player, and allowing you to view results as soon as they are submitted.
                    </p>
                </div>
                <img src="https://res.cloudinary.com/divlee1zx/image/upload/v1748732716/tennis-art1_gmqavd.png" alt="" className="hidden xl:block h-128" />
            </div>
        </div>
    )
}

function AboutTheDev() {
    return (
        <div className="standard-container text-white! bg-slate-950/75 justify-between flex flex-col">
            <h3 className="home-subtitle">About the Developer</h3>
            <div className="flex flex-col gap-1.5 text-xl font-bold">
                <p>
                    I am a long-time tennis player and self-taught developer from the shining city of Bristol in the UK. I've played tennis since I was around eight years old 
                    (although I'm not sure my skill reflects this!) and played for several clubs over the years.
                </p>
                <p>
                    In the last few years, I've taught myself web developement and work occassionally as a freelance web developer in my spare time. 
                    <i>Tennis Tournament Creator</i> therefore brings together two passions in life - tennis and programming. I certainly don't claim to have mastered either, 
                    but this is an application which has proven incredibly useful in my own life (having hosted club tournaments myself).
                </p>
                <p>
                    I am constantly looking to improve this application, so if you have any suggestions or face any specific issues, please email me 
                    at <a href="mailto:tennistournamentcreator@gmail.com">tennistournamentcreator@gmail.com</a>.
                </p>
                <p>
                    If you are a developer and wish to contribute towards a new feature or help fix an existing but, please submit/read issues at the <a 
                        href="https://github.com/louispallett/lowpal-tennis"
                    >GitHub repo</a>.
                </p>
            </div>
        </div>
    )
}