import { type AuthUser } from "wasp/auth";
import DarkModeSwitcher from "../../client/components/DarkModeSwitcher";
import { UserDropdown } from "../../user/UserDropdown";
import MessageButton from "../dashboards/messages/MessageButton";

const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
  user: AuthUser;
}) => {
  return (
    <header className="bg-white border-[#E2E8F0] sticky top-0 z-10 flex w-full border-b shadow-sm">
      <div className="flex grow items-center justify-between px-6 py-3.5 sm:justify-end sm:gap-5">
        <div className="flex items-center gap-3 lg:hidden">
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
            }}
            className="flex flex-col justify-center gap-1.5 w-8 h-8 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] transition-colors p-1.5"
          >
            <span className={`block h-0.5 bg-[#475569] rounded-full transition-all ${props.sidebarOpen ? 'w-full rotate-45 translate-y-2' : 'w-full'}`} />
            <span className={`block h-0.5 bg-[#475569] rounded-full transition-all ${props.sidebarOpen ? 'opacity-0' : 'w-3/4'}`} />
            <span className={`block h-0.5 bg-[#475569] rounded-full transition-all ${props.sidebarOpen ? 'w-full -rotate-45 -translate-y-2' : 'w-1/2'}`} />
          </button>
        </div>

        <ul className="2xsm:gap-4 flex items-center gap-2">
          {/* <!-- Dark Mode Toggler --> */}
          <DarkModeSwitcher />
          {/* <!-- Dark Mode Toggler --> */}

          {/* <!-- Chat Notification Area --> */}
          <MessageButton />
          {/* <!-- Chat Notification Area --> */}
        </ul>

        <div className="2xsm:gap-7 flex items-center gap-3">
          {/* <!-- User Area --> */}
          <UserDropdown user={props.user} />
          {/* <!-- User Area --> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
