import { getUserTournaments } from "@/lib/tournaments";
import { TournamentType } from "@/lib/types";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import Link from "next/link";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export default async function Dashboard() {
    const cookieStore = cookies();
    const token = (await cookieStore).get("token")?.value;

    const { payload } = await jwtVerify(token!, JWT_SECRET);
    const userId:any = payload.userId;

    const tournaments = await getUserTournaments(userId);
    let tournamentsHosting = tournaments[0];
    let tournamentsPlaying = tournaments[1];
    
    const hostingIds = new Set(tournamentsHosting.map(tournament => tournament._id.toString()));

    const filteredTournamentsPlaying = tournamentsPlaying.filter(tournament =>
        !hostingIds.has(tournament._id.toString())
    );
    const tournamentsPlayingFiltered = {
        signUps: filteredTournamentsPlaying.filter(x => x.stage === "sign-up"),
        draws: filteredTournamentsPlaying.filter(x => x.stage === "draw"),
        actives: filteredTournamentsPlaying.filter(x => x.stage === "play"),
        finished: filteredTournamentsPlaying.filter(x => x.stage === "finished")
    }
    const tournamentsHostingFiltered = {
        signUps: tournamentsHosting.filter(x => x.stage === "sign-up"),
        draws: tournamentsHosting.filter(x => x.stage === "draw"),
        actives: tournamentsHosting.filter(x => x.stage === "play"),
        finished: tournamentsHosting.filter(x => x.stage === "finished")
    }
    const isHosting = tournamentsHosting.length > 0
    const isPlaying = filteredTournamentsPlaying.length > 0;

    return (
        <div className="flex flex-col gap-2.5 sm:mx-1.5 lg:mx-5">
            <div className="standard-container bg-lime-500">
                <h3 className="main-title-sm">Dashboard</h3>
            </div>
            { isHosting && (
                <>
                    <div className="standard-container container-indigo flex flex-col gap-5">
                        <h3 className="italic">Hosting tournaments</h3>
                        { tournamentsHostingFiltered.signUps.length > 0 && (
                            <div className="flex flex-col gap-2.5">
                                { tournamentsHostingFiltered.signUps.map((item) => (
                                    <UserTournamentHosting 
                                    data={item} 
                                    tournamentsPlaying={tournamentsPlayingFiltered} 
                                    key={item._id} 
                                    />
                                ))}
                            </div>
                        )}
                        { tournamentsHostingFiltered.draws.length > 0 && (
                            <div className="flex flex-col gap-2.5">
                                { tournamentsHostingFiltered.draws.map((item) => (
                                    <UserTournamentHosting 
                                    data={item} 
                                    tournamentsPlaying={tournamentsPlayingFiltered} 
                                    key={item._id} 
                                    />
                                ))}
                            </div>
                        )}
                        { tournamentsHostingFiltered.actives.length > 0 && (
                            <div className="flex flex-col gap-2.5">
                                { tournamentsHostingFiltered.actives.map((item) => (
                                    <UserTournamentHosting 
                                    data={item} 
                                    tournamentsPlaying={tournamentsPlayingFiltered} 
                                    key={item._id} 
                                    />
                                ))}
                            </div>
                        )}
                        { tournamentsHostingFiltered.finished.length > 0 && (
                            <div className="flex flex-col gap-2.5">
                                { tournamentsHostingFiltered.finished.map((item) => (
                                    <UserTournamentHosting 
                                    data={item} 
                                    tournamentsPlaying={tournamentsPlayingFiltered} 
                                    key={item._id} 
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="racket-cross-wrapper">
                        <img src="/assets/images/racket-red.svg" alt="" />
                        <img src="/assets/images/racket-blue.svg" alt="" />
                    </div>
                </>
            )}
            { isPlaying && (
                <>
                    <div className="standard-container container-indigo flex flex-col gap-2.5">
                        <h3 className="italic">Joined Tournaments</h3>
                        <p>Go to a tournament page by clicking on a tournament below:</p>
                        { tournamentsPlayingFiltered.signUps.length > 0 && (
                            <div className="flex flex-col gap-2.5">
                                { tournamentsPlayingFiltered.signUps.map((item) => (
                                    <UserTournamentPlaying data={item} key={item._id} />
                                ))}
                            </div>
                        )}
                        { tournamentsPlayingFiltered.draws.length > 0 && (
                            <div className="flex flex-col gap-2.5">
                                { tournamentsPlayingFiltered.draws.map((item) => (
                                    <UserTournamentPlaying data={item} key={item._id} />
                                ))}
                            </div>
                        )}
                        { tournamentsPlayingFiltered.actives.length > 0 && (
                            <div className="flex flex-col gap-2.5">
                                { tournamentsPlayingFiltered.actives.map((item) => (
                                    <UserTournamentPlaying data={item} key={item._id} />
                                ))}
                            </div>
                        )}
                        { tournamentsPlayingFiltered.finished.length > 0 && (
                            <div className="flex flex-col gap-2.5">
                                { tournamentsPlayingFiltered.finished.map((item) => (
                                    <UserTournamentPlaying data={item} key={item._id} />
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="racket-cross-wrapper">
                        <img src="/assets/images/racket-red.svg" alt="" />
                        <img src="/assets/images/racket-blue.svg" alt="" />
                    </div>
                </>
            )}
            <CreateORJoin />
        </div>
    )
}

type UserTournamentPlayingProps = { data:TournamentType }

function UserTournamentPlaying({ data }:UserTournamentPlayingProps) {
    return (
        <Link href={"/dashboard/" + data._id} className="standard-container-no-shadow container-indigo-interactive">
            <h3>{data.name}</h3>
            <div className="tournament-grid-sm">
                <p>Host: {data.host["name-long"]}</p>
                <p>Stage: <i>{data.stage}</i></p>
                <p>Date Created: {data.startDateFormatted}</p>
            </div>
        </Link>
    )
}

type UserTournamentHostingProps = {
    data:TournamentType,
    tournamentsPlaying: {
        signUps:TournamentType[],
        draws:TournamentType[],
        actives:TournamentType[],
        finished:TournamentType[],
    }
}

const idEquals = (a:any, b:any) => {
    return a.toString() === b.toString();
}

function UserTournamentHosting({ data, tournamentsPlaying }:UserTournamentHostingProps) {
    // const joined = 
    //     tournamentsPlaying.signUps.some(item => idEquals(item._id, data._id)) ||
    //     tournamentsPlaying.draws.some(item => idEquals(item._id, data._id)) ||
    //     tournamentsPlaying.actives.some(item => idEquals(item._id, data._id));
    // const isFinished = data.stage === "finished";

    return (
        <div className="hosting-wrapper">
            <Link href={"/dashboard/" + data._id} className="standard-container-no-shadow container-indigo-interactive">
                <h3>{data.name}</h3>
                <div className="tournament-grid-sm">
                    <p>Host: {data.host["name-long"]}</p>
                    <p>Stage: <i>{data.stage}</i></p>
                    <p>Date Created: {data.startDateFormatted}</p>
                </div>
            </Link>
            {/* { joined ? (
                <div className={isFinished ? "hidden" : "standard-container-no-shadow container-lime-interactive hover:bg-lime-500/75!"}>
                    <div className="flex lg:flex-col justify-center items-center gap-2.5">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#054205" className="size-24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        <p className="text-center">Playing in tournament</p>
                    </div>
                </div>
            ) : (
                <Link href="users/join-existing-tournament-form" className={isFinished ? "hidden" : "standard-container-no-shadow container-lime-interactive"}>
                    <div className="flex lg:flex-col justify-center items-center gap-2.5">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#054205" className="size-24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-2.25-1.313M21 7.5v2.25m0-2.25-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3 2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75 2.25-1.313M12 21.75V19.5m0 2.25-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" />
                        </svg>
                        <p className="text-center">Join this tournament</p>
                    </div>
                </Link>
            )} */}
        </div>
    )
}

function CreateORJoin() {
    return (
        <div className="standard-container container-indigo flex flex-col gap-2.5">
                <h3 className="italic text-center">Create or join a new tournament</h3>
            <div className="flex flex-col md:grid grid-cols-2 gap-2.5">
                <Link href="/dashboard/new-tournaments/host" className="standard-container container-lime-interactive">
                    <div className="flex lg:flex-col justify-center items-center gap-2.5">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#054205" className="size-24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0 0 15 0m-15 0a7.5 7.5 0 1 1 15 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077 1.41-.513m14.095-5.13 1.41-.513M5.106 17.785l1.15-.964m11.49-9.642 1.149-.964M7.501 19.795l.75-1.3m7.5-12.99.75-1.3m-6.063 16.658.26-1.477m2.605-14.772.26-1.477m0 17.726-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205 12 12m6.894 5.785-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495" />
                    </svg>

                        <p className="text-center">Create a new tournament</p>
                    </div>
                </Link>
                <Link href="/dashboard/new-tournaments/join" className="standard-container container-lime-interactive">
                    <div className="flex lg:flex-col justify-center items-center gap-2.5">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#054205" className="size-24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-2.25-1.313M21 7.5v2.25m0-2.25-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3 2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75 2.25-1.313M12 21.75V19.5m0 2.25-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" />
                        </svg>
                        <p className="text-center">Join an existing tournament</p>
                    </div>
                </Link>
            </div>
        </div>
    )
}