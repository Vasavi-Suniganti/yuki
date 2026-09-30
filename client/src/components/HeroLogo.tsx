import { Snowflake } from 'lucide-react';
import { Link } from 'react-router-dom';

export function HeroLogo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 text-lg font-black tracking-[0.2em] text-[#183647]">
      <Snowflake className="h-6 w-6 text-[#487b91]" />
      <span>Yuki</span>
    </Link>
  );
}
