export default function Loading() {
  return (
    <div className="flex flex-col gap-5 items-center justify-center mt-16">
        <div className="racket-cross-wrapper">
            <img src="/assets/images/racket-red.svg" alt="" />
            <img src="/assets/images/racket-blue.svg" alt="" />
        </div>
        <img src="/assets/images/tennis-ball.svg" className="w-24 spinner border-0!" alt="" />
    </div>
  );
}

