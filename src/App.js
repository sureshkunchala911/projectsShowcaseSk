import Loader from 'react-loader-spinner'
import {useState, useEffect} from 'react'
import './App.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'initial',
  success: 'success',
  loading: 'loading',
  failure: 'failure',
}

const Items = props => {
  const {projects} = props
  const {imageUrl, name} = projects
  return (
    <li className="list">
      <img src={imageUrl} alt={name} className="image" />
      <p className="name">{name}</p>
    </li>
  )
}

const App = () => {
  const [category, setCategory] = useState(categoriesList[0].id)
  const [projectsList, setProjectsList] = useState([])
  const [apiResponse, setApiResponse] = useState(apiStatusConstants.initial)

  useEffect(() => {
    const getProjectsList = async () => {
      setApiResponse(apiStatusConstants.loading)
      const url = `https://apis.ccbp.in/ps/projects?category=${category}`
      const options = {method: 'GET'}
      const response = await fetch(url, options)
      const responseData = await response.json()
      if (response.ok) {
        const formattedData = responseData.projects.map(each => ({
          id: each.id,
          imageUrl: each.image_url,
          name: each.name,
        }))
        setProjectsList(formattedData)
        setApiResponse(apiStatusConstants.success)
      } else {
        setApiResponse(apiStatusConstants.failure)
      }
    }
    getProjectsList()
  }, [category])

  const onRetry = async () => {
    setApiResponse(apiStatusConstants.loading)
    const url = `https://apis.ccbp.in/ps/projects?category=${category}`
    const options = {method: 'GET'}
    const response = await fetch(url, options)
    const responseData = await response.json()
    if (response.ok) {
      const formattedData = responseData.projects.map(each => ({
        id: each.id,
        imageUrl: each.image_url,
        name: each.name,
      }))
      setProjectsList(formattedData)
      setApiResponse(apiStatusConstants.success)
    } else {
      setApiResponse(apiStatusConstants.failure)
    }
  }

  const onChangeCategory = event => setCategory(event.target.value)

  const renderSuccessView = () => (
    <ul className="category-list">
      {projectsList.map(each => (
        <Items key={each.id} projects={each} />
      ))}
    </ul>
  )

  const renderLoadingView = () => (
    <div className="loading-container" testid="loader">
      <Loader type="ThreeDots" color="#328af2" height={30} width={30} />
    </div>
  )

  const renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-desc">
        We cannot seem to find the page you are looking for
      </p>
      <button className="retry-button" type="button" onClick={onRetry}>
        Retry
      </button>
    </div>
  )

  const renderApiView = () => {
    switch (apiResponse) {
      case apiStatusConstants.success:
        return renderSuccessView()
      case apiStatusConstants.loading:
        return renderLoadingView()
      case apiStatusConstants.failure:
        return renderFailureView()
      default:
        return null
    }
  }

  return (
    <>
      <nav className="nav-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
          alt="website logo"
          className="logo"
        />
      </nav>
      <div className="app-container">
        <div className="selectDiv">
          <select
            className="select-category"
            value={category}
            onChange={onChangeCategory}
          >
            {categoriesList.map(each => (
              <option key={each.id} value={each.id}>
                {each.displayText}
              </option>
            ))}
          </select>
        </div>
        {renderApiView()}
      </div>
    </>
  )
}

export default App
