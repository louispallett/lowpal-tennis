import tw from 'twin.macro';

export { 
    BackgroundContainer, 
    BackgroundContainerCentre, 
    BoxContainer, 
    HeaderContainer, 
    HeaderContainerInner,
    UsersContainer, 
};

const BackgroundContainer = tw.div`relative flex min-h-screen flex-col overflow-hidden bg-gray-200 dark:bg-slate-900 py-0`;
const BackgroundContainerCentre = tw.div`relative flex justify-center min-h-screen flex-col overflow-hidden bg-gray-50 dark:bg-slate-900 py-6 sm:py-12`;
const UsersContainer = tw.div`px-6 pt-10 pb-8 shadow-xl ring-1 ring-gray-900/5 sm:mx-auto sm:rounded-lg max-sm:px-5 sm:px-8 dark:bg-slate-700`;
const BoxContainer = tw.div`flex flex-col justify-center items-center bg-none px-0 pt-10 pb-8 sm:mx-auto sm:max-w-lg sm:rounded-lg sm:px-10`;
const HeaderContainer = tw.header`relative flex justify-center z-20 bg-blue-950 py-3 pl-5 pr-3 sm:pl-6 sm:pr-4 md:pr-3.5 lg:px-6 space-x-4 antialiased border-b border-gray-500`;
const HeaderContainerInner = tw.div`flex justify-between max-w-screen-2xl items-center flex-1`;