import { Github, Play, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="py-16 px-6">
      <div className="container mx-auto text-center">
        <div className="max-w-4xl mx-auto p-12">
          <h2 className="text-4xl font-semibold font-poppins mb-2">
            Ready to transform your learning journey?
          </h2>
          <p className="text-xl mb-12 txt-dim">
            Join thousands of students who are staying organized, motivated, and
            achieving their academic goals with EduHaven.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              variant="primary"
              onClick={() => navigate("/authenticate")}
              className="flex items-center space-x-3 px-8 py-4 rounded-lg text-white font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              style={{ backgroundColor: "var(--btn)" }}
            >
              <Play size={20} />
              <span>Get Started for Free</span>
            </Button>

            <a
              href="https://github.com/Eduhaven/eduhaven"
              className="flex items-center space-x-3 px-8 py-4 rounded-lg font-semibold text-lg border-2 hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              style={{ borderColor: "var(--btn)", color: "var(--btn)" }}
            >
              <Github size={20} />
              <span>View on GitHub</span>
            </a>
          </div>

          <div className="mt-8 flex justify-center">
            <div
              className="flex items-center space-x-6 text-sm"
              style={{ color: "var(--txt-dim)" }}
            >
              <div className="flex items-center space-x-2">
                <Check size={16} className="text-green-500" />
                <span>Free forever</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check size={16} className="text-green-500" />
                <span>Open source</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check size={16} className="text-green-500" />
                <span>No credit card required</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTASection;