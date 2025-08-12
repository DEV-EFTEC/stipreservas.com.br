export default function Text({ children, heading, ...props }) {
  function returnTag() {
    switch (heading) {
      case 'h1':
        return <h1 className="text-3xl md:text-4xl text-black font-bold">{children}</h1>;
      case 'h2':
        return <h2 className="text-xl md:text-2xl text-sky-950 font-bold">{children}</h2>;
      case 'h3':
        return <h3 className="text-lg md:text-xl text-black font-bold">{children}</h3>;
      case 'h4':
        return <h3 className="text-md md:text-lg text-black font-bold">{children}</h3>;
      case 'small':
        return <p className="text-sm text-muted-foreground">{children}</p>
    }
  }
  return returnTag();
}