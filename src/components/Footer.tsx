
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Compass, Heart, Map, Mail, MessageCircle } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted py-10 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Compass className="h-6 w-6 text-travel-primary" />
              <span className="font-bold text-xl">Journey Compass</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Платформа для открытия, планирования и обмена маршрутами путешествий со всего мира.
            </p>
            <div className="flex space-x-3">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
                <span className="sr-only">Facebook</span>
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
                <span className="sr-only">Twitter</span>
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
                <span className="sr-only">Instagram</span>
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Навигация</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-travel-primary">
                  Главная
                </Link>
              </li>
              <li>
                <Link to="/routes" className="text-muted-foreground hover:text-travel-primary">
                  Исследовать маршруты
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="text-muted-foreground hover:text-travel-primary">
                  Избранное
                </Link>
              </li>
              <li>
                <Link to="/routes/create" className="text-muted-foreground hover:text-travel-primary">
                  Создать маршрут
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Популярные категории</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/routes?category=beach" className="text-muted-foreground hover:text-travel-primary">
                  Пляжный отдых
                </Link>
              </li>
              <li>
                <Link to="/routes?category=mountains" className="text-muted-foreground hover:text-travel-primary">
                  Горные маршруты
                </Link>
              </li>
              <li>
                <Link to="/routes?category=city" className="text-muted-foreground hover:text-travel-primary">
                  Городские прогулки
                </Link>
              </li>
              <li>
                <Link to="/routes?category=food" className="text-muted-foreground hover:text-travel-primary">
                  Гастрономические туры
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Связаться с нами</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>info@journeycompass.ru</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <MessageCircle className="h-4 w-4" />
                <span>Поддержка: support@journeycompass.ru</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm mb-4 md:mb-0">
            &copy; {currentYear} Journey Compass. Все права защищены.
          </p>
          <div className="flex space-x-4 text-sm">
            <Link to="/privacy" className="text-muted-foreground hover:text-travel-primary">
              Политика конфиденциальности
            </Link>
            <Link to="/terms" className="text-muted-foreground hover:text-travel-primary">
              Условия использования
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
