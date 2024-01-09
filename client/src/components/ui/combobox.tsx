import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCallback, useEffect, useState } from "react";
import { LanguageName, langNames } from "@uiw/codemirror-extensions-langs";

export function LanguageList(props: {
  onChange?: (value: string | undefined) => void;
}) {
  const { onChange } = props;
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<LanguageName | null>(null);

  const handleSelect = useCallback((val: string) => {
    setValue(value === val ? null : (val as LanguageName));
    setOpen(false);
  }, []);

  useEffect(() => {
    onChange && onChange(value as LanguageName);
  }, [value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value ? value : "Plain Text"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] max-h-[400px] overflow-y-scroll p-0">
        <Command>
          <CommandInput placeholder="Search framework..." />
          <CommandEmpty>No language found.</CommandEmpty>
          <CommandGroup>
            {langNames.map((lang) => {
              if (lang === "asciiArmor") return;

              return (
                <CommandItem key={lang} value={lang} onSelect={handleSelect}>
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === lang ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {lang}
                </CommandItem>
              );
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
