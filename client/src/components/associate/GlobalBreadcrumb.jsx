import { useLocation, Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator
} from "../ui/breadcrumb";
import { Slash } from "lucide-react";
import { enumRoutes } from "@/lib/enumRoutes";

function toTitleCase(str) {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function GlobalBreadcrumb() {
  const location = useLocation();

  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <Breadcrumb className="w-full flex space-x-4 py-4">

      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;

        const isLast = index === pathnames.length - 1;

        return (
          <div key={to} className="flex items-center space-x-4">
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {isLast ? (
                <BreadcrumbLink isCurrentPage asChild className="text-sky-700">
                  <span className="capitalize">
                    {enumRoutes[value] || toTitleCase(decodeURIComponent(value))}
                  </span>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to={to} className="capitalize">
                    {enumRoutes[value] || toTitleCase(decodeURIComponent(value))}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </div>
        );
      })}
    </Breadcrumb>
  );
}
