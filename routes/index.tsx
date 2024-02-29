function VariablePill({ name }: { name: string }) {
  return (
    <span className="bg-orange-200 text-orange-600 rounded-md border border-orange-400">
      {name}
    </span>
  );
}
export default function Home() {
  return (
    <div className="p-4">
      <div className="text-lg font-bold">API</div>
      <div className="mt-4 flex flex-row items-center bg-stone-200 border border-stone-600 p-2 rounded-md">
        /api/rates/<VariablePill name="{currency}" />
      </div>
      <div className="flex flex-row gap-2 mt-2">
        <div className="font-bold">currency</div>
        <div>3-letter currency code</div>
      </div>
      <div className="font-semibold mt-2">Optional query arguments</div>
      <div className="flex flex-row gap-2">
        <div className="font-bold">start</div>
        <div>Start date: YYYY-MM-DD. Defaults to start of month</div>
      </div>
      <div className="flex flex-row gap-2">
        <div className="font-bold">end</div>
        <div>End date: YYYY-MM-DD. Defaults to today</div>
      </div>
    </div>
  );
}
