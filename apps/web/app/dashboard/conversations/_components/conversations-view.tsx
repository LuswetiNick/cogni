import Image from "next/image";

const ConversationsView = () => {
  return (
    <div className="flex h-full flex-1 flex-col gap-y-4 bg-muted">
      <div className="flex flex-1 items-center justify-center gap-x-2">
        {/* LOGO */}
        <Image src="/logo.svg" alt="Cogni" width={25} height={25} />
        <h1 className="text-lg font-bold">Cogni</h1>
      </div>
    </div>
  );
};
export default ConversationsView;
