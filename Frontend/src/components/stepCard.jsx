function StepCard({
    stepNumber,
    title,
    description,
    icon: Icon,
    children,
    ...props
    
  }) {

  return (
      <div {...props}>
        <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl hover:opacity-90 transition-all duration-300">
          <div className="flex flex-col lg:flex-row items-center gap-8" >
            <div className=" flex-1 text-center lg:text-left" >
              <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
                <div className="card-text w-16 h-16 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 rounded-2xl flex items-center justify-center text-gray-800 font-bold text-2xl shadow-lg">
                  {stepNumber}
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 rounded-xl flex items-center justify-center">
                  <Icon className="w-6 h-6 text-gray-800" />
                </div>
              </div>
              <h2 className="card-text text-3xl md:text-4xl font-bold text-gray-800 mb-4 leading-tight">
                {title}
              </h2>
              <p className="card-text text-xl text-gray-600 leading-relaxed mb-6">
                {description}
              </p>
              {children}
            </div>
          </div>
        </div>
      </div>
    );
}

export default StepCard
