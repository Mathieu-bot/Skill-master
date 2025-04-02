import Header from "../Header";
import Footer from "../Footer";
import Analysis from "../sections/Analysis";
import Services from "../sections/Services";
import AIFeatures from "../sections/AIFeatures";


const HomePage = () => {


    return (
        <div className="flex-grow">
            <Header />
            <Analysis />
            <Services />
            <AIFeatures />
            <Footer />
        </div>
        )
  };
  export default HomePage