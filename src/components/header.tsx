import Link from "next/link";

import UserNav from "@/components/user-nav";

const Header = () => {
  return (
    <header className="border-b bg-muted py-4">
      <div className="container flex items-center justify-between">
        <nav className="flex items-center">
          <Link
            href="/dashboard"
            className="text-xl font-medium tracking-tight text-foreground hover:text-foreground/70"
          >
            e-commerce
          </Link>

          <ul className="ml-16 flex items-center gap-8">
            <li>
              <Link
                href="/dashboard"
                className="text-sm font-medium tracking-tight hover:text-zinc-700"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/orders"
                className="text-sm font-medium tracking-tight hover:text-zinc-700"
              >
                Orders
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/products"
                className="text-sm font-medium tracking-tight hover:text-zinc-700"
              >
                Products
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/categories"
                className="text-sm font-medium tracking-tight hover:text-zinc-700"
              >
                Categories
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/users"
                className="text-sm font-medium tracking-tight hover:text-zinc-700"
              >
                Users
              </Link>
            </li>
          </ul>
        </nav>

        <UserNav />
      </div>
    </header>
  );
};

export default Header;
