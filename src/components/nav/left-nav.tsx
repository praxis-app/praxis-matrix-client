const LeftNav = () => {
  return (
    <div className="flex h-full w-[240px] flex-col border-r border-[--color-border] bg-(--card)">
      <div className="h-[55px] border-b border-[--color-border]"></div>
      <div className="flex flex-1 flex-col"></div>
      <div className="h-[55px] border-t border-[--color-border]"></div>
    </div>
  );
};

export { LeftNav };
