import { useLocation, Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator
} from "../ui/breadcrumb";
import { Slash } from "lucide-react";

export default function GlobalBreadcrumb() {
  const location = useLocation();

  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <Breadcrumb className="w-full flex space-x-4 py-4">
      <BreadcrumbItem>
        <BreadcrumbLink asChild>
          <Link to="/associado/home">Início</Link>
        </BreadcrumbLink>
      </BreadcrumbItem>

      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;

        const isLast = index === pathnames.length - 1;

        return (
          <div key={to} className="flex items-center space-x-4">
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {isLast ? (
                <BreadcrumbLink isCurrentPage asChild className={"text-sky-700"}>
                  <span className="capitalize">{decodeURIComponent(value).replace("-", " ")}</span>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to={to} className="capitalize">
                    {decodeURIComponent(value).replace("-", " ")}
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
