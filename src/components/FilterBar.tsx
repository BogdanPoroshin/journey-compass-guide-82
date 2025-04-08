
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Category } from "@/api/types";
import { FilterX } from "lucide-react";

interface FilterBarProps {
  categories: Category[];
  onFilterChange: (filters: any) => void;
  initialFilters?: any;
}

const FilterBar = ({
  categories,
  onFilterChange,
  initialFilters,
}: FilterBarProps) => {
  const [selectedCategories, setSelectedCategories] = useState<number[]>(
    initialFilters?.categories || []
  );
  const [difficulty, setDifficulty] = useState<string | null>(
    initialFilters?.difficulty || null
  );
  const [duration, setDuration] = useState<[number, number]>(
    initialFilters?.duration || [1, 14]
  );
  const [cost, setCost] = useState<[number, number]>(
    initialFilters?.cost || [0, 5000]
  );
  const [sort, setSort] = useState(initialFilters?.sort || "popular");

  useEffect(() => {
    // Применяем фильтры при их изменении
    const filters = {
      categories: selectedCategories,
      difficulty,
      duration,
      cost,
      sort,
    };

    onFilterChange(filters);
  }, [selectedCategories, difficulty, duration, cost, sort, onFilterChange]);

  const handleCategoryChange = (categoryId: number, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, categoryId]);
    } else {
      setSelectedCategories(selectedCategories.filter((id) => id !== categoryId));
    }
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setDifficulty(null);
    setDuration([1, 14]);
    setCost([0, 5000]);
    setSort("popular");
  };

  return (
    <Card className="sticky top-20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Фильтры</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="h-8 px-2 text-xs"
          >
            <FilterX className="h-3.5 w-3.5 mr-1" />
            Сбросить
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Сортировка */}
        <div>
          <h3 className="text-sm font-medium mb-2">Сортировка</h3>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger>
              <SelectValue placeholder="Сортировать по" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">По популярности</SelectItem>
              <SelectItem value="newest">Сначала новые</SelectItem>
              <SelectItem value="oldest">Сначала старые</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Категории */}
        <div>
          <h3 className="text-sm font-medium mb-3">Категории</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center">
                <Checkbox
                  id={`category-${category.id}`}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={(checked) =>
                    handleCategoryChange(category.id, checked as boolean)
                  }
                  className="mr-2"
                />
                <label
                  htmlFor={`category-${category.id}`}
                  className="text-sm cursor-pointer"
                >
                  {category.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Уровень сложности */}
        <div>
          <h3 className="text-sm font-medium mb-3">Уровень сложности</h3>
          <RadioGroup value={difficulty || ""} onValueChange={setDifficulty}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Легкий" id="difficulty-easy" />
              <label htmlFor="difficulty-easy" className="text-sm cursor-pointer">
                Легкий
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Средний" id="difficulty-medium" />
              <label htmlFor="difficulty-medium" className="text-sm cursor-pointer">
                Средний
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Сложный" id="difficulty-hard" />
              <label htmlFor="difficulty-hard" className="text-sm cursor-pointer">
                Сложный
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Экстремальный" id="difficulty-extreme" />
              <label htmlFor="difficulty-extreme" className="text-sm cursor-pointer">
                Экстремальный
              </label>
            </div>
          </RadioGroup>
        </div>

        {/* Продолжительность */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Продолжительность (дни)</h3>
            <span className="text-xs text-muted-foreground">
              {duration[0]} - {duration[1]}
            </span>
          </div>
          <Slider
            value={[duration[0], duration[1]]}
            min={1}
            max={30}
            step={1}
            onValueChange={(value) => setDuration([value[0], value[1]])}
            className="py-4"
          />
        </div>

        {/* Стоимость */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium">Стоимость (₽)</h3>
            <span className="text-xs text-muted-foreground">
              {cost[0].toLocaleString()} - {cost[1].toLocaleString()}
            </span>
          </div>
          <Slider
            value={[cost[0], cost[1]]}
            min={0}
            max={100000}
            step={1000}
            onValueChange={(value) => setCost([value[0], value[1]])}
            className="py-4"
          />
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          onClick={resetFilters}
          variant="outline"
          className="w-full text-sm"
        >
          Сбросить все фильтры
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FilterBar;
