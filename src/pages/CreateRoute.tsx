import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MapView from "@/components/MapView";
import { Input, NumericInput } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { getCategories, createRoute } from "@/api/supabaseApi";
import { Category } from "@/api/types";
import { useUser } from "@/contexts/UserContext";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Upload, Info } from "lucide-react";

const routeSchema = z.object({
  title: z.string().min(3, {
    message: "Название должно содержать не менее 3 символов.",
  }),
  description: z.string().min(10, {
    message: "Описание должно содержать не менее 10 символов.",
  }),
  duration: z.number().min(1, {
    message: "Продолжительность должна быть не менее 1 дня.",
  }),
  distance: z.number().nullable(),
  difficulty_level: z.string().nullable(),
  estimated_cost: z.number().nullable(),
  is_public: z.boolean().default(false),
  categories: z.array(z.number()).optional(),
  image_url: z.string().optional(),
  points: z.array(
    z.object({
      name: z.string(),
      description: z.string().nullable(),
      latitude: z.number(),
      longitude: z.number(),
      address: z.string().nullable(),
      type: z.string().nullable(),
    })
  ).optional(),
});

const CreateRoutePage = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [categories, setCategories] = useState<Category[]>([]);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [isPublic, setIsPublic] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    };

    fetchCategories();
  }, []);

  const form = useForm<z.infer<typeof routeSchema>>({
    resolver: zodResolver(routeSchema),
    defaultValues: {
      title: "",
      description: "",
      duration: 1,
      distance: null,
      difficulty_level: null,
      estimated_cost: null,
      is_public: false,
      categories: [],
      image_url: undefined,
      points: [],
    },
  });

  const onSubmit = async (values: z.infer<typeof routeSchema>) => {
    if (!user) {
      toast({
        title: "Ошибка",
        description: "Необходимо войти в систему для создания маршрута.",
        variant: "destructive",
      });
      return;
    }

    const routeData = {
      ...values,
      duration: Number(values.duration),
      distance: values.distance ? Number(values.distance) : null,
      estimated_cost: values.estimated_cost ? Number(values.estimated_cost) : null,
      image_url: imageUrl,
      is_public: isPublic,
    };

    console.log("Данные маршрута:", routeData);

    const newRoute = await createRoute(routeData, user.id);

    if (newRoute) {
      toast({
        title: "Маршрут создан",
        description: "Ваш маршрут успешно создан.",
      });
      navigate(`/routes/${newRoute.id}`);
    } else {
      toast({
        title: "Ошибка",
        description: "Не удалось создать маршрут.",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageUrl("https://source.unsplash.com/random/?travel");
      toast({
        title: "Изображение загружено",
        description: "Изображение успешно загружено.",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow py-10 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <Button variant="ghost" onClick={() => navigate("/routes")} className="gap-1 mb-2">
              <ArrowLeft className="h-4 w-4" />
              Назад к маршрутам
            </Button>
            <h1 className="text-3xl font-bold">Создание нового маршрута</h1>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Название маршрута</FormLabel>
                        <FormControl>
                          <Input placeholder="Введите название маршрута" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Описание маршрута</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Опишите маршрут, его особенности и интересные места"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field: { onChange, ...field } }) => (
                        <FormItem>
                          <FormLabel>Продолжительность (дни)</FormLabel>
                          <FormControl>
                            <NumericInput
                              placeholder="Укажите примерную продолжительность"
                              onChange={(e) => onChange(e.target.valueAsNumber || 1)}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="distance"
                      render={({ field: { onChange, value, ...field } }) => (
                        <FormItem>
                          <FormLabel>Примерное расстояние (км)</FormLabel>
                          <FormControl>
                            <NumericInput
                              placeholder="Укажите примерное расстояние"
                              onChange={(e) => {
                                const val = e.target.value === "" ? null : e.target.valueAsNumber;
                                onChange(val);
                              }}
                              value={value === null ? "" : value}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="difficulty_level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Уровень сложности</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите уровень сложности" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Легкий">Легкий</SelectItem>
                            <SelectItem value="Средний">Средний</SelectItem>
                            <SelectItem value="Сложный">Сложный</SelectItem>
                            <SelectItem value="Экстремальный">Экстремальный</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="estimated_cost"
                    render={({ field: { onChange, value, ...field } }) => (
                      <FormItem>
                        <FormLabel>Примерная стоимость (₽)</FormLabel>
                        <FormControl>
                          <NumericInput
                            placeholder="Укажите примерную стоимость"
                            onChange={(e) => {
                              const val = e.target.value === "" ? null : e.target.valueAsNumber;
                              onChange(val);
                            }}
                            value={value === null ? "" : value}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="categories"
                    render={() => (
                      <FormItem>
                        <FormLabel>Категории</FormLabel>
                        <div className="flex flex-wrap gap-2">
                          {categories.map((category) => (
                            <FormField
                              key={category.id}
                              control={form.control}
                              name="categories"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    className="flex flex-row items-center space-x-2 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(category.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...(field.value || []), category.id])
                                            : field.onChange(
                                              field.value?.filter(
                                                (value: number) => value !== category.id
                                              )
                                            );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {category.name}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center justify-between">
                    <Label htmlFor="isPublic">Сделать маршрут общедоступным?</Label>
                    <Switch
                      id="isPublic"
                      checked={isPublic}
                      onCheckedChange={(checked) => {
                        setIsPublic(checked);
                        form.setValue("is_public", checked || false);
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="border rounded-lg overflow-hidden bg-background">
                    <MapView height="300px" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image">
                      Изображение маршрута
                      <Info className="h-4 w-4 inline-block ml-1 align-text-top" />
                    </Label>
                    <Input
                      type="file"
                      id="image"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <Button asChild variant="outline">
                      <label htmlFor="image" className="flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        Загрузить изображение
                      </label>
                    </Button>
                    {imageUrl && (
                      <div className="relative">
                        <img
                          src={imageUrl}
                          alt="Preview"
                          className="rounded-md shadow-sm"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              <Button type="submit" className="bg-travel-primary hover:bg-travel-primary/90">
                Создать маршрут
              </Button>
            </form>
          </Form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreateRoutePage;
