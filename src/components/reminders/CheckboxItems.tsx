
import { Checkbox } from "@/components/ui/checkbox";

interface CheckboxItem {
  value: number;
  label: string;
}

interface CheckboxItemsProps {
  items: CheckboxItem[];
  values: number[];
  onChange: (values: number[]) => void;
}

export function CheckboxItems({ items, values, onChange }: CheckboxItemsProps) {
  const toggleItem = (value: number) => {
    const newValues = values.includes(value)
      ? values.filter((v) => v !== value)
      : [...values, value].sort((a, b) => b - a); // Sort descending
    
    onChange(newValues);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {items.map((item) => (
        <div key={item.value} className="flex items-center space-x-2">
          <Checkbox
            id={`timing-${item.value}`}
            checked={values.includes(item.value)}
            onCheckedChange={() => toggleItem(item.value)}
          />
          <label
            htmlFor={`timing-${item.value}`}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {item.label}
          </label>
        </div>
      ))}
    </div>
  );
}

export { type CheckboxItem };
