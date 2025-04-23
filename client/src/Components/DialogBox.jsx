import { Dialog } from '@headlessui/react'

const getDialogInfo = (reason) => {
    let dialogInfo = "";

    switch(reason) {
        case "seeded":
            dialogInfo = {
                title: "What's a Seeded Player?",
                content1: `A seeded player is a player who is of a higher standard so that the host doesn't want to match with 
                            another seeded player. This is useful for when teams for doubles categories are randomly created, since 
                            it tells the computer to NOT match a seeded player with another one.`,
                content2: `Please confirm with the host of the 
                            tournament whether you are a seeded player or not.\nIf you are unsure, please leave this blank - the host can 
                            always amend it later on.`
            }
            break;
        case "gender":
            dialogInfo = {
                title: "Why do we need this?"

            }
            break;
        case "userExists":
            dialogInfo = {
                title: "Already signed up",
                content1: `It looks like you're trying to sign up with an email address which has already been registered to another account. 
                            If you want to create a new tournament or join an existing tournament, please sign in and scroll to the bottom of 
                            your dashboard, where you'll be able to select 'Create a tournament' or 'Join an existing tournament'`,
            }
        default:
            dialogInfo = {
                title: "",
                content: ""
            }
            break;
    }

    return dialogInfo;
}

export default function DialogBox({ isOpen, setIsOpen }) {
    const dialogInfo = getDialogInfo(isOpen);

    return (
        <Dialog as="div" open={isOpen != false ? true : false} onClose={() => setIsOpen(false)} className="relative z-50 m-0 p-0">
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
            <div className="fixed inset-0 flex w-screen items-center justify-center sm:p-4 ">
                <Dialog.Panel as="div" className="max-w-4xl standard-container bg-slate-100">
                    <div className="flex flex-col gap-5">
                        <h3 className="">{dialogInfo.title}</h3>
                        <p>{dialogInfo.content1}</p>
                        <p>{dialogInfo.content2}</p>
                        <div className="flex w-full">
                            <button className="submit" onClick={() => setIsOpen(false)}><b>Close</b></button>
                        </div>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    )
}