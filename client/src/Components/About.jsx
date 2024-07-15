export default function About() {
    return (
        <section className="flex flex-col p-2.5 sm:p-5 sm:min-w-minArticle sm:max-w-maxArticle">
            <div className="bg-lime-600 rounded-b-none rounded-lg shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.2)]">
                <h3 className="p-3 text-2xl font-sedan font-bold tracking-tight text-gray-100 sm:text-4xl sm:font-black sm:p-5">How to use this site</h3>
            </div>
            <div className="flex flex-col min-w-full bg-white rounded-lg rounded-t-none bg-slate-100 shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.2)] dark:bg-slate-700">
                <div className="flex flex-col p-5 gap-2.5 dark:text-slate-100">
                    <p>Firstly, thank you for using this site. I've created a few websites over the past year or so, but none quite to this scale. I'm grateful for your willingness to make the process of running the In-House tournament a little less labourous for those who organise it.</p>
                    <p>This guide gives a basic breakdown on how to use this website. Any suggestions for improvements (whether they be in the user interface, styling, etc.) are most welcome.</p>
                    <h5 className="font-sedan my-1 text-xl text-center">The Menu</h5>
                    <p>In the top right of the screen you will see the menu. You can navigate to all the main parts of the site from here.</p>
                    <hr className="mx-2.5" />
                    <h5 className="font-sedan my-1 text-xl text-center">Your dashboard</h5>
                    <p>The dashboard is the main page which you will likely spend most of your time. From here, you can find some basic information on the website, how to report issues if you encounter any, and the matches you are set to play.</p>
                    <p>The matches, which will appear either to the right-side of the screen (on larger screens) or at the bottom (on smaller screens), give you basic information about the match. Namely: who you are playing and the deadline in which you need to play the match.</p>
                    <p>To get more information about the match, click anywhere on the match and you will be navigated to the page for that match., which we'll cover next.</p>
                    <p>Note: only matches which you are <b>scheduled</b> to play will appear here (e.g., matches which you have been assigned but have <i>not</i> entered the score for).</p>
                    <hr className="mx-2.5" />
                    <h5 className="font-sedan my-1 text-xl text-center">The Match Screen</h5>
                    <p>Here, you will find more information about the specific match as well as the contact details for each player in that match.</p>
                    <p>At the bottom of the screen, you should see the submission form for submitting scores. If both parties haven't yet been assigned, you'll see a message telling you (and, obviously, won't be able to submit any results).</p>
                    <p><b>The most important</b> bit is to select a winner, as this actually sends the winners to the next match. You'll be able to enter a score too, but note that this is basically just text to display on the brackets.</p>
                    <hr className="mx-2.5" />
                    <h5 className="font-sedan my-1 text-xl text-center">Brackets</h5>
                    <p>Bracket lists and brackets</p>
                    <hr className="mx-2.5" />
                    <h5 className="font-sedan my-1 text-xl text-center">Tournament Rules</h5>
                    <p></p>
                </div>
            </div>
        </section>
    )
}