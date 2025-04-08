
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { CalendarIcon, SlidersHorizontal, X } from "lucide-react";

interface Category {
  id: number;
  name: string;
}

interface FilterBarProps {
  categories: Category[];
  onFilterChange: (filters: any) => void;
}

const FilterBar = ({ categories, onFilterChange }: FilterBarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [duration, setDuration] = useState<[number, number]>([1, 14]);
  const [cost, setCost] = useState<[number, number]>([0, 5000]);
  const [durationRange, setDurationRange] = useState<string>("any");
  const [sort, setSort] = useState("popular");

  const handleCategoryChange = (categoryId: number, checked: boolean) => {
    setSelectedCategories((prev) =>
      checked
        ? [...prev, categoryId]
        : prev.filter((id) => id !== categoryId)
    );
  };

  const handleFilterApply = () => {
    onFilterChange({
      categories: selectedCategories,
      difficulty,
      duration,
      cost,
      sort,
    });
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setDifficulty(null);
    setDuration([1, 14]);
    setCost([0, 5000]);
    setDurationRange("any");
    setSort("popular");
    
    onFilterChange({
      categories: [],
      difficulty: null,
      duration: [1, 14],
      cost: [0, 5000],
      sort: "popular",
    });
  };

  const difficultyOptions = [
    { label: "Any Difficulty", value: null },
    { label: "Easy", value: "Easy" },
    { label: "Moderate", value: "Moderate" },
    { label: "Hard", value: "Hard" },
    { label: "Extreme", value: "Extreme" },
  ];

  const handleDurationRangeChange = (value: string) => {
    setDurationRange(value);
    switch (value) {
      case "short":
        setDuration([1, 3]);
        break;
      case "medium":
        setDuration([4, 7]);
        break;
      case "long":
        setDuration([8, 14]);
        break;
      case "any":
      default:
        setDuration([1, 14]);
    }
  };

  const sortOptions = [
    { label: "Most Popular", value: "popular" },
    { label: "Newest", value: "newest" },
    { label: "Highest Rated", value: "rating" },
    { label: "Duration (Short to Long)", value: "duration_asc" },
    { label: "Duration (Long to Short)", value: "duration_desc" },
  ];

  return (
    <>
      {/* Mobile filter button */}
      <div className="flex md:hidden justify-between items-center mb-4">
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={() => setIsOpen(!isOpen)}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>
      </div>
      
      {/* Filter sidebar */}
      <div
        className={`fixed inset-0 z-50 md:z-0 md:relative md:block transition-transform transform ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } bg-white md:bg-transparent md:p-0 p-4 overflow-auto md:overflow-visible`}
      >
        <div className="flex justify-between items-center mb-4 md:hidden">
          <h2 className="text-lg font-medium">Filters</h2>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <Card className="sticky top-4">
          <CardContent className="p-4">
            {/* Sort options - Desktop */}
            <div className="hidden md:block mb-6">
              <Label htmlFor="sort-select" className="text-sm font-medium mb-2 block">
                Sort By
              </Label>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Categories */}
            <Accordion type="single" collapsible defaultValue="categories">
              <AccordionItem value="categories">
                <AccordionTrigger className="text-sm font-medium">Categories</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 mt-2">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category.id}`}
                          checked={selectedCategories.includes(category.id)}
                          onCheckedChange={(checked) =>
                            handleCategoryChange(category.id, checked === true)
                          }
                        />
                        <Label
                          htmlFor={`category-${category.id}`}
                          className="text-sm cursor-pointer"
                        >
                          {category.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Difficulty */}
              <AccordionItem value="difficulty">
                <AccordionTrigger className="text-sm font-medium">Difficulty</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 mt-2">
                    {difficultyOptions.map((option) => (
                      <div key={option.value || 'any'} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id={`difficulty-${option.value || 'any'}`}
                          name="difficulty"
                          checked={difficulty === option.value}
                          onChange={() => setDifficulty(option.value)}
                          className="text-travel-primary focus:ring-travel-primary"
                        />
                        <Label
                          htmlFor={`difficulty-${option.value || 'any'}`}
                          className="text-sm cursor-pointer"
                        >
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Duration */}
              <AccordionItem value="duration">
                <AccordionTrigger className="text-sm font-medium">Duration</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 mt-2">
                    <div className="flex flex-wrap gap-2">
                      {[
                        { label: "Any", value: "any" },
                        { label: "1-3 days", value: "short" },
                        { label: "4-7 days", value: "medium" },
                        { label: "8+ days", value: "long" },
                      ].map((option) => (
                        <Button
                          key={option.value}
                          variant={durationRange === option.value ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleDurationRangeChange(option.value)}
                          className={
                            durationRange === option.value
                              ? "bg-travel-primary hover:bg-travel-primary/90"
                              : ""
                          }
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                    <div className="pt-2">
                      <div className="flex justify-between text-xs text-muted-foreground mb-2">
                        <span>{duration[0]} days</span>
                        <span>{duration[1]} days</span>
                      </div>
                      <Slider
                        value={duration}
                        min={1}
                        max={30}
                        step={1}
                        onValueChange={(newValue: number[]) => setDuration([newValue[0], newValue[1]])}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Budget */}
              <AccordionItem value="budget">
                <AccordionTrigger className="text-sm font-medium">Budget</AccordionTrigger>
                <AccordionContent>
                  <div className="pt-2">
                    <div className="flex justify-between text-xs text-muted-foreground mb-2">
                      <span>${cost[0]}</span>
                      <span>${cost[1]}+</span>
                    </div>
                    <Slider
                      value={cost}
                      min={0}
                      max={10000}
                      step={100}
                      onValueChange={(newValue: number[]) => setCost([newValue[0], newValue[1]])}
                      className="mt-2"
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="flex flex-col gap-2 mt-6">
              <Button onClick={handleFilterApply} className="w-full bg-travel-primary hover:bg-travel-primary/90">
                Apply Filters
              </Button>
              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="w-full border-travel-primary text-travel-primary hover:bg-travel-primary/10"
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Backdrop for mobile filter menu */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 md:hidden" 
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default FilterBar;
