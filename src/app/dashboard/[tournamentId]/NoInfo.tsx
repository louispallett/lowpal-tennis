"use client"

export default function NoInfo({ text }: { text:string }) {
    return (
        <div className="flex flex-col justify-center items-center gap-8">
            <div className="racket-cross-wrapper">
                <img src="/assets/images/racket-red.svg" alt="" />
                <img src="/assets/images/racket-blue.svg" alt="" />
            </div>
            <p>{text}</p>
        </div>
    )
}