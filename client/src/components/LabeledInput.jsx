import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function LabeledInput({ label, value, onChange, id = '', ...props }) {
  return (
    <div className="flex flex-col w-80 gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        value={value}
        onChange={onChange}
        {...props}
      />
    </div>
  );
}
