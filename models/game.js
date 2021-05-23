const TITLE_LENGTH = 25;
const ESRB_RATING_MAX = 5;
const USER_RATING_MIN = 1;
const USER_RATING_MAX = 5;

module.exports = function(sequelize, DataTypes) {
    return sequelize.define("game", {
        title: {
            type: DataTypes.STRING(TITLE_LENGTH),
            allowNull: false,
        },

        owner_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        studio: {
            type: DataTypes.STRING,
            allowNull: false,            
        },

        esrb_rating: {
            type: DataTypes.CHAR(ESRB_RATING_MAX),
            allowNull: false,
        },

        user_rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: USER_RATING_MIN,
                max: USER_RATING_MAX
            }
        },

        have_played : {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        }
    })
}