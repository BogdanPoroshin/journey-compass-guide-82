
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useUser } from "@/contexts/UserContext";
import { createRoute, getCategories, Category } from "@/api/supabaseApi";
import { ArrowLeft, Save, Plus, Minus, Map } from "lucide-react";
import { useEffect } from "react";

const CreateRoutePage = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: 1,
    distance: "",
    difficulty_level: "Средний",
    estimated_cost: "",
    categories: [] as number[],
    is_public: true,
    image_url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop"
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories();
      setCategories(data);
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Преобразуем строковое значение в число или в пустую строку, если значение некорректно
    const numValue = value === "" ? "" : parseFloat(value);
    setFormData({ ...formData, [name]: numValue });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleCategoryChange = (categoryId: number, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        categories: [...formData.categories, categoryId],
      });
    } else {
      setFormData({
        ...formData,
        categories: formData.categories.filter((id) => id !== categoryId),
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert("Необходимо войти в систему!");
      return;
    }
    
    if (!formData.title || !formData.description || !formData.duration) {
      alert("Пожалуйста, заполните все обязательные поля!");
      return;
    }
    
    setLoading(true);
    
    try {
      const route = await createRoute(formData, user.id);
      
      if (route) {
        navigate(`/routes/${route.id}`);
      }
    } catch (error) {
      console.error("Ошибка при создании маршрута:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow py-10 bg-muted/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link to="/routes" className="text-muted-foreground hover:text-foreground flex items-center gap-1 mb-6">
            <ArrowLeft className="h-4 w-4" />
            Назад к маршрутам
          </Link>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Создать новый маршрут</CardTitle>
              <CardDescription>
                Заполните информацию о вашем маршруте, чтобы поделиться им с другими путешественниками
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                {/* Основная информация */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Основная информация</h3>
                  
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="title">Название маршрута *</Label>
                      <Input
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        placeholder="Например: Золотое кольцо России"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Описание маршрута *</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                        placeholder="Опишите маршрут, его особенности и достопримечательности"
                        rows={5}
                      />
                    </div>
                  </div>
                </div>

                {/* Детали маршрута */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Детали маршрута</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="duration">Продолжительность (дней) *</Label>
                      <Input
                        id="duration"
                        name="duration"
                        type="number"
                        min="1"
                        value={formData.duration}
                        onChange={handleNumberChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="distance">Расстояние (км)</Label>
                      <Input
                        id="distance"
                        name="distance"
                        type="number"
                        min="0"
                        step="0.1"
                        value={formData.distance}
                        onChange={handleNumberChange}
                        placeholder="Необязательно"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="difficulty_level">Уровень сложности</Label>
                      <Select
                        value={formData.difficulty_level}
                        onValueChange={(value) => handleSelectChange("difficulty_level", value)}
                      >
                        <SelectTrigger id="difficulty_level">
                          <SelectValue placeholder="Выберите уровень сложности" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Легкий">Легкий</SelectItem>
                          <SelectItem value="Средний">Средний</SelectItem>
                          <SelectItem value="Сложный">Сложный</SelectItem>
                          <SelectItem value="Экстремальный">Экстремальный</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="estimated_cost">Ориентировочная стоимость (₽)</Label>
                      <Input
                        id="estimated_cost"
                        name="estimated_cost"
                        type="number"
                        min="0"
                        step="100"
                        value={formData.estimated_cost}
                        onChange={handleNumberChange}
                        placeholder="Необязательно"
                      />
                    </div>
                  </div>
                </div>

                {/* Категории */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Категории</h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category.id}`}
                          checked={formData.categories.includes(category.id)}
                          onCheckedChange={(checked) =>
                            handleCategoryChange(category.id, checked as boolean)
                          }
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

                {/* Дополнительные настройки */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Дополнительные настройки</h3>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_public"
                      checked={formData.is_public}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          is_public: checked as boolean,
                        })
                      }
                    />
                    <label
                      htmlFor="is_public"
                      className="text-sm cursor-pointer"
                    >
                      Сделать маршрут публичным (доступным для всех пользователей)
                    </label>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/routes")}
                  disabled={loading}
                >
                  Отмена
                </Button>
                <Button
                  type="submit"
                  className="bg-travel-primary hover:bg-travel-primary/90"
                  disabled={loading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? "Сохранение..." : "Сохранить маршрут"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreateRoutePage;
