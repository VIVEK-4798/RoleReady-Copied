import Wrapper from "@/components/layout/Wrapper";
import MainHome from "../pages/homes/home_1";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Home || Startups24x7 - Discover, Connect & Grow with Startups",
  description: "Startups24x7 - A platform to explore top startups, services, events, and growth opportunities.",
};

export default function Home() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <Wrapper>
        <MainHome />
      </Wrapper>
    </>
  );
}
