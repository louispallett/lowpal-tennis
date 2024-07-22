import menuImg from "/assets/images/menu.png";
import matchHome from "/assets/images/match-home.png";
import matchInfo from "/assets/images/match-info.png";
import submitMatch1 from "/assets/images/submit-match1.png";
import submitMatch2 from "/assets/images/submit-match2.png";
import submitMatch3 from "/assets/images/submit-match3.png";
import submitMatch4 from "/assets/images/submit-match4.png";
import submitMatch5 from "/assets/images/submit-match5.png";

export default function About() {
    return (
        <section className="flex flex-col p-1.5 sm:p-5 sm:min-w-minArticle sm:max-w-maxArticle">
            <div className="bg-lime-600 rounded-b-none rounded-lg shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.2)]">
                <h3 className="p-3 text-2xl font-sedan font-bold tracking-tight text-gray-100 sm:text-4xl sm:font-black sm:p-5">How to use this site</h3>
            </div>
            <div className="flex flex-col min-w-full bg-white rounded-lg rounded-t-none bg-slate-100 shadow-[4.0px_8.0px_8.0px_rgba(0,0,0,0.2)] dark:bg-slate-700">
                <div className="flex flex-col p-5 gap-2.5 dark:text-slate-100">
                    <p>Firstly, thank you for using this site. I've created a few websites over the past year or so, but none quite to this scale. I'm grateful for your willingness to make the process of running the In-House tournament a little less labourous for those who organise it.</p>
                    <p>This guide gives a basic breakdown on how to use this website. Any suggestions for improvements (whether they be in the user interface, styling, etc.) are most welcome.</p>
                    <h5 className="font-sedan my-1 text-xl text-center">The Menu</h5>
                    <div className="flex flex-col gap-5">
                        <p>In the top right of the screen you will see the menu. You can navigate to all the main parts of the site from here:</p>
                        <img src={menuImg} className="max-w-60 self-center" alt="" />
                    </div>
                    <hr className="mx-2.5" />
                    <h5 className="font-sedan my-1 text-xl text-center">Your dashboard</h5>
                    <div className="flex flex-col gap-2.5">
                        <p>The dashboard is the main page which you will likely spend most of your time. From here, you can find some basic information on the website, how to report issues if you encounter any, and the matches you are set to play.</p>
                        <p>The matches, which will appear either to the right-side of the screen (on larger screens) or at the bottom (on smaller screens), give you basic information about the match. Namely: who you are playing and the deadline in which you need to play the match.</p>
                        <p>To get more information about the match, click anywhere on the match and you will be navigated to the page for that match., which we'll cover next.</p>
                        <p>Note: only matches which you are <b>scheduled</b> to play will appear here (e.g., matches which you have been assigned but have <i>not</i> entered the score for).</p>
                        <img src={matchHome} className="max-h-60 self-center" alt="" />
                    </div>
                    <hr className="mx-2.5" />
                    <h5 className="font-sedan my-1 text-xl text-center">The Match Screen</h5>
                    <div className="flex flex-col gap-2.5">
                        <p>Here, you will find more information about the specific match as well as the contact details for each player in that match:</p>
                        <img src={matchInfo} className="max-h-60 self-center" alt="" />
                        <p>At the bottom of the screen, you should see the submission form for submitting scores. If both parties haven't yet been assigned, you'll see a message telling you (and, obviously, won't be able to submit any results).</p>
                        <p><b>The most important</b> bit is to select a winner, as this actually sends the winners to the next match:</p>
                        <img src={submitMatch1} className="max-h-60 self-center" alt="" />
                        <p>You'll be able to enter a score too, but note that this is basically just text to display on the brackets:</p>
                        <img src={submitMatch2} className="max-h-60 self-center" alt="" />
                        <p>In the example above, let's say the score was <b>6-0 6-2</b>, we'd write the scores in the table like so:</p>
                        <img src={submitMatch3} className="max-h-60 self-center" alt="" />
                        <p>This should hopefully be very straightforward. If you play a tie break on one of the sets, you'll want to write out the number of games followed by the points in the tie break in brackets. In the example below, the winning team wins the second set via a tie break, winning 7 points to 4. So, the full score is <b>6-4 7(7)-6(4)</b>:</p>
                        <img src={submitMatch4} className="max-h-60 self-center" alt="" />
                        <p>Again, I should stress that this is <i>just text</i>, so the score isn't checked and evaluated. This is why submitting a winner here is the most important part and you are asked to do this before you can enter a score.</p>
                        <p>Finally, if you do go to a third set/match tie break, click the checkbox and enter the scores. If you play a third set, this works very much like the other sets, whilst if you play a tie break, just write down the final score for this tie break. In the example below, we have the winning team win the tie break by 10 points to 6:</p>
                        <img src={submitMatch5} className="max-h-60 self-center" alt="" />
                    </div>
                    <hr className="mx-2.5" />
                    <h5 className="font-sedan my-1 text-xl text-center">Brackets</h5>
                    <p>If you use the menu to navigate to 'results', you'll find each tournament listed. From here, you can select a tournament and will be navigated to that bracket where you will see the current scoring. Note that qualifying matches do not appear on the brackets.</p>
                    <p>Viewing the brackets on your phone is absolutely possible, since the image is created with an SVG Viewer. However, admittedly it does look better on larger screens as you can view the entire bracket - this is, of course, the same with viewing any bracket on a smaller screen.</p>
                    <hr className="mx-2.5" />
                    <h5 className="font-sedan my-1 text-xl text-center">Tournament Rules</h5>
                    <p>If you need to refresh your memory on the tournament rules, please navigate to them on the menu.</p>
                </div>
            </div>
        </section>
    )
}